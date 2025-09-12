const express = require("express");
const { body, param } = require("express-validator");
const { supabaseAdmin } = require("../config/supabase");
const { authenticateToken, requireRole } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validation");

const router = express.Router();

// Get user profile
router.get("/profile", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", req.user.id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: "User profile not found" });
    }

    // Remove sensitive information
    const { password, ...profile } = data;

    res.json(profile);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Update user profile
router.put(
  "/profile",
  [
    body("name").optional().notEmpty().trim(),
    body("phone").optional().trim(),
    body("date_of_birth").optional().isISO8601(),
    body("gender").optional().isIn(["male", "female", "other"]),
    body("address").optional().trim(),
    body("emergency_contact").optional().trim(),
    body("blood_type")
      .optional()
      .isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
    body("allergies").optional().isArray(),
    body("chronic_conditions").optional().isArray(),
  ],
  validateRequest,
  authenticateToken,
  async (req, res) => {
    try {
      const updateData = {
        ...req.body,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from("users")
        .update(updateData)
        .eq("id", req.user.id)
        .select()
        .single();

      if (error) throw error;

      // Remove sensitive information
      const { password, ...profile } = data;

      res.json({
        message: "Profile updated successfully",
        profile,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: "Failed to update user profile" });
    }
  }
);

// Get all doctors (for booking consultations)
router.get("/doctors", async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select(
        "id, name, email, specialization, experience_years, rating, is_available"
      )
      .eq("role", "doctor")
      .eq("is_active", true);

    if (error) throw error;

    res.json({
      doctors: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Failed to fetch doctors" });
  }
});

// Get doctor details
router.get(
  "/doctors/:id",
  [param("id").isUUID()],
  validateRequest,
  async (req, res) => {
    try {
      const { data, error } = await supabaseAdmin
        .from("users")
        .select(
          "id, name, email, specialization, experience_years, rating, bio, education, is_available"
        )
        .eq("id", req.params.id)
        .eq("role", "doctor")
        .eq("is_active", true)
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({ error: "Doctor not found" });
      }

      // Get doctor's availability slots
      const { data: slots } = await supabaseAdmin
        .from("doctor_availability")
        .select("*")
        .eq("doctor_id", req.params.id)
        .eq("is_available", true)
        .gte("date", new Date().toISOString().split("T")[0]);

      res.json({
        ...data,
        availability_slots: slots || [],
      });
    } catch (error) {
      console.error("Error fetching doctor details:", error);
      res.status(500).json({ error: "Failed to fetch doctor details" });
    }
  }
);

// Update doctor availability (doctors only)
router.post(
  "/availability",
  [
    body("date").isISO8601(),
    body("start_time").matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body("end_time").matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    body("is_available").isBoolean(),
  ],
  validateRequest,
  authenticateToken,
  requireRole(["doctor"]),
  async (req, res) => {
    try {
      const availabilityData = {
        ...req.body,
        doctor_id: req.user.id,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from("doctor_availability")
        .upsert(availabilityData, {
          onConflict: "doctor_id,date,start_time",
        })
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        message: "Availability updated successfully",
        availability: data,
      });
    } catch (error) {
      console.error("Error updating availability:", error);
      res.status(500).json({ error: "Failed to update availability" });
    }
  }
);

// Get user statistics
router.get("/stats", authenticateToken, async (req, res) => {
  try {
    const userRole = req.user.user_metadata?.role || "patient";
    const stats = {};

    if (userRole === "patient") {
      // Patient statistics
      const [consultationsResult, recordsResult, prescriptionsResult] =
        await Promise.all([
          supabaseAdmin
            .from("consultations")
            .select("id", { count: "exact" })
            .eq("patient_id", req.user.id),
          supabaseAdmin
            .from("health_records")
            .select("id", { count: "exact" })
            .eq("user_id", req.user.id),
          supabaseAdmin
            .from("prescriptions")
            .select("id", { count: "exact" })
            .eq("patient_id", req.user.id),
        ]);

      stats.total_consultations = consultationsResult.count || 0;
      stats.total_health_records = recordsResult.count || 0;
      stats.total_prescriptions = prescriptionsResult.count || 0;
    } else if (userRole === "doctor") {
      // Doctor statistics
      const [consultationsResult, prescriptionsResult] = await Promise.all([
        supabaseAdmin
          .from("consultations")
          .select("id", { count: "exact" })
          .eq("doctor_id", req.user.id),
        supabaseAdmin
          .from("prescriptions")
          .select("id", { count: "exact" })
          .eq("prescribed_by", req.user.id),
      ]);

      stats.total_consultations = consultationsResult.count || 0;
      stats.total_prescriptions = prescriptionsResult.count || 0;
    }

    res.json(stats);
  } catch (error) {
    console.error("Error fetching user statistics:", error);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

module.exports = router;
