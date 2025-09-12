const express = require("express");
const { body, param } = require("express-validator");
const { supabaseAdmin } = require("../config/supabase");
const { authenticateToken, requireRole } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validation");

const router = express.Router();

// Get consultations for authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const userRole = req.user.user_metadata?.role || "patient";
    let query = supabaseAdmin.from("consultations").select(`
      *,
      patient:users!consultations_patient_id_fkey(id, name, email),
      doctor:users!consultations_doctor_id_fkey(id, name, email)
    `);

    if (userRole === "patient") {
      query = query.eq("patient_id", req.user.id);
    } else if (userRole === "doctor") {
      query = query.eq("doctor_id", req.user.id);
    }

    const { data, error } = await query.order("scheduled_at", {
      ascending: false,
    });

    if (error) throw error;

    res.json({
      consultations: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error("Error fetching consultations:", error);
    res.status(500).json({ error: "Failed to fetch consultations" });
  }
});

// Get specific consultation
router.get(
  "/:id",
  [param("id").isUUID()],
  validateRequest,
  authenticateToken,
  async (req, res) => {
    try {
      const { data, error } = await supabaseAdmin
        .from("consultations")
        .select(
          `
        *,
        patient:users!consultations_patient_id_fkey(id, name, email),
        doctor:users!consultations_doctor_id_fkey(id, name, email)
      `
        )
        .eq("id", req.params.id)
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({ error: "Consultation not found" });
      }

      // Check if user has access to this consultation
      const userRole = req.user.user_metadata?.role || "patient";
      if (userRole === "patient" && data.patient_id !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }
      if (userRole === "doctor" && data.doctor_id !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json(data);
    } catch (error) {
      console.error("Error fetching consultation:", error);
      res.status(500).json({ error: "Failed to fetch consultation" });
    }
  }
);

// Book new consultation (patients only)
router.post(
  "/",
  [
    body("doctor_id").isUUID(),
    body("scheduled_at").isISO8601(),
    body("type").isIn(["video", "in_person", "phone"]),
    body("symptoms").optional().trim(),
    body("notes").optional().trim(),
  ],
  validateRequest,
  authenticateToken,
  requireRole(["patient"]),
  async (req, res) => {
    try {
      // Verify doctor exists
      const { data: doctor, error: doctorError } = await supabaseAdmin
        .from("users")
        .select("id, role")
        .eq("id", req.body.doctor_id)
        .eq("role", "doctor")
        .single();

      if (doctorError || !doctor) {
        return res.status(400).json({ error: "Invalid doctor ID" });
      }

      const consultationData = {
        ...req.body,
        patient_id: req.user.id,
        status: "scheduled",
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from("consultations")
        .insert(consultationData)
        .select(
          `
        *,
        patient:users!consultations_patient_id_fkey(id, name, email),
        doctor:users!consultations_doctor_id_fkey(id, name, email)
      `
        )
        .single();

      if (error) throw error;

      res.status(201).json({
        message: "Consultation booked successfully",
        consultation: data,
      });
    } catch (error) {
      console.error("Error booking consultation:", error);
      res.status(500).json({ error: "Failed to book consultation" });
    }
  }
);

// Update consultation status (doctors only)
router.patch(
  "/:id/status",
  [
    param("id").isUUID(),
    body("status").isIn(["scheduled", "in_progress", "completed", "cancelled"]),
    body("notes").optional().trim(),
  ],
  validateRequest,
  authenticateToken,
  requireRole(["doctor"]),
  async (req, res) => {
    try {
      const updateData = {
        status: req.body.status,
        updated_at: new Date().toISOString(),
      };

      if (req.body.notes) {
        updateData.notes = req.body.notes;
      }

      if (req.body.status === "completed") {
        updateData.completed_at = new Date().toISOString();
      }

      const { data, error } = await supabaseAdmin
        .from("consultations")
        .update(updateData)
        .eq("id", req.params.id)
        .eq("doctor_id", req.user.id)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        return res
          .status(404)
          .json({ error: "Consultation not found or access denied" });
      }

      res.json({
        message: "Consultation status updated successfully",
        consultation: data,
      });
    } catch (error) {
      console.error("Error updating consultation:", error);
      res.status(500).json({ error: "Failed to update consultation" });
    }
  }
);

// Cancel consultation
router.delete(
  "/:id",
  [param("id").isUUID()],
  validateRequest,
  authenticateToken,
  async (req, res) => {
    try {
      const userRole = req.user.user_metadata?.role || "patient";
      let query = supabaseAdmin
        .from("consultations")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", req.params.id);

      if (userRole === "patient") {
        query = query.eq("patient_id", req.user.id);
      } else if (userRole === "doctor") {
        query = query.eq("doctor_id", req.user.id);
      }

      const { data, error } = await query.select().single();

      if (error) throw error;

      if (!data) {
        return res
          .status(404)
          .json({ error: "Consultation not found or access denied" });
      }

      res.json({ message: "Consultation cancelled successfully" });
    } catch (error) {
      console.error("Error cancelling consultation:", error);
      res.status(500).json({ error: "Failed to cancel consultation" });
    }
  }
);

module.exports = router;
