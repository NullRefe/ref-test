const express = require("express");
const { body, param } = require("express-validator");
const { supabaseAdmin } = require("../config/supabase");
const { authenticateToken } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validation");

const router = express.Router();

// Get all health records for authenticated user
router.get("/", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("health_records")
      .select(
        `
        *,
        consultations (
          id,
          scheduled_at,
          status,
          doctor_name
        )
      `
      )
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      records: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error("Error fetching health records:", error);
    res.status(500).json({ error: "Failed to fetch health records" });
  }
});

// Get specific health record
router.get(
  "/:id",
  [param("id").isUUID()],
  validateRequest,
  authenticateToken,
  async (req, res) => {
    try {
      const { data, error } = await supabaseAdmin
        .from("health_records")
        .select("*")
        .eq("id", req.params.id)
        .eq("user_id", req.user.id)
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({ error: "Health record not found" });
      }

      res.json(data);
    } catch (error) {
      console.error("Error fetching health record:", error);
      res.status(500).json({ error: "Failed to fetch health record" });
    }
  }
);

// Create new health record
router.post(
  "/",
  [
    body("title").notEmpty().trim(),
    body("description").optional().trim(),
    body("type").isIn([
      "consultation",
      "prescription",
      "lab_result",
      "vaccination",
      "surgery",
    ]),
    body("date").isISO8601(),
    body("doctor_name").optional().trim(),
    body("attachments").optional().isArray(),
  ],
  validateRequest,
  authenticateToken,
  async (req, res) => {
    try {
      const recordData = {
        ...req.body,
        user_id: req.user.id,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from("health_records")
        .insert(recordData)
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        message: "Health record created successfully",
        record: data,
      });
    } catch (error) {
      console.error("Error creating health record:", error);
      res.status(500).json({ error: "Failed to create health record" });
    }
  }
);

// Update health record
router.put(
  "/:id",
  [
    param("id").isUUID(),
    body("title").optional().notEmpty().trim(),
    body("description").optional().trim(),
    body("type")
      .optional()
      .isIn([
        "consultation",
        "prescription",
        "lab_result",
        "vaccination",
        "surgery",
      ]),
    body("date").optional().isISO8601(),
    body("doctor_name").optional().trim(),
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
        .from("health_records")
        .update(updateData)
        .eq("id", req.params.id)
        .eq("user_id", req.user.id)
        .select()
        .single();

      if (error) throw error;

      if (!data) {
        return res.status(404).json({ error: "Health record not found" });
      }

      res.json({
        message: "Health record updated successfully",
        record: data,
      });
    } catch (error) {
      console.error("Error updating health record:", error);
      res.status(500).json({ error: "Failed to update health record" });
    }
  }
);

// Delete health record
router.delete(
  "/:id",
  [param("id").isUUID()],
  validateRequest,
  authenticateToken,
  async (req, res) => {
    try {
      const { error } = await supabaseAdmin
        .from("health_records")
        .delete()
        .eq("id", req.params.id)
        .eq("user_id", req.user.id);

      if (error) throw error;

      res.json({ message: "Health record deleted successfully" });
    } catch (error) {
      console.error("Error deleting health record:", error);
      res.status(500).json({ error: "Failed to delete health record" });
    }
  }
);

module.exports = router;
