const express = require("express");
const { body, param, query } = require("express-validator");
const { supabaseAdmin } = require("../config/supabase");
const { authenticateToken, requireRole } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validation");

const router = express.Router();

// Validation schemas for medication data
const medicationValidation = [
  body("name").notEmpty().withMessage("Medication name is required").trim(),
  body("generic_name").optional().trim(),
  body("dosage").optional().trim(),
  body("frequency").optional().trim(),
  body("duration").optional().trim(),
  body("instructions").optional().trim(),
  body("prescribed_by").optional().trim(),
  body("prescription_date")
    .optional()
    .isISO8601()
    .withMessage("Invalid prescription date"),
  body("start_date").optional().isISO8601().withMessage("Invalid start date"),
  body("end_date").optional().isISO8601().withMessage("Invalid end date"),
  body("is_active")
    .optional()
    .isBoolean()
    .withMessage("is_active must be true or false"),
  body("refills_remaining")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Refills must be a positive integer"),
  body("cost").optional().isNumeric().withMessage("Cost must be a number"),
  body("pharmacy_name").optional().trim(),
  body("pharmacy_location").optional().trim(),
  body("availability_status").optional().trim(),
  body("alternatives")
    .optional()
    .isJSON()
    .withMessage("Alternatives must be valid JSON"),
  body("reminder_times")
    .optional()
    .isJSON()
    .withMessage("Reminder times must be valid JSON"),
  body("side_effects").optional().trim(),
  body("category").optional().trim(),
];

// GET /api/medications - Get all medications for the authenticated user
router.get(
  "/",
  authenticateToken,
  [
    query("category").optional().trim(),
    query("is_active").optional().isBoolean(),
    query("search").optional().trim(),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("offset").optional().isInt({ min: 0 }),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user.id;
      let query = supabaseAdmin
        .from("medications")
        .select("*")
        .eq("user_id", userId);

      // Apply filters
      if (req.query.category) {
        query = query.eq("category", req.query.category);
      }

      if (req.query.is_active !== undefined) {
        query = query.eq("is_active", req.query.is_active === "true");
      }

      if (req.query.search) {
        query = query.or(
          `name.ilike.%${req.query.search}%,generic_name.ilike.%${req.query.search}%,prescribed_by.ilike.%${req.query.search}%`
        );
      }

      // Pagination
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;
      query = query.range(offset, offset + limit - 1);

      // Ordering
      query = query.order("prescription_date", { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      res.json({
        medications: data || [],
        count: data?.length || 0,
        pagination: {
          limit,
          offset,
          has_more: data?.length === limit,
        },
      });
    } catch (error) {
      console.error("Error fetching medications:", error);
      res.status(500).json({ error: "Failed to fetch medications" });
    }
  }
);

// GET /api/medications/:id - Get a specific medication
router.get(
  "/:id",
  authenticateToken,
  [param("id").isUUID().withMessage("Invalid medication ID")],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const medicationId = req.params.id;

      const { data, error } = await supabaseAdmin
        .from("medications")
        .select("*")
        .eq("_id", medicationId)
        .eq("user_id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return res.status(404).json({ error: "Medication not found" });
        }
        throw error;
      }

      res.json({ medication: data });
    } catch (error) {
      console.error("Error fetching medication:", error);
      res.status(500).json({ error: "Failed to fetch medication" });
    }
  }
);

// POST /api/medications - Create a new medication
router.post(
  "/",
  authenticateToken,
  medicationValidation,
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const medicationData = {
        ...req.body,
        user_id: userId,
      };

      // Parse JSON fields if they exist
      if (
        medicationData.alternatives &&
        typeof medicationData.alternatives === "string"
      ) {
        medicationData.alternatives = JSON.parse(medicationData.alternatives);
      }
      if (
        medicationData.reminder_times &&
        typeof medicationData.reminder_times === "string"
      ) {
        medicationData.reminder_times = JSON.parse(
          medicationData.reminder_times
        );
      }

      const { data, error } = await supabaseAdmin
        .from("medications")
        .insert(medicationData)
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        message: "Medication created successfully",
        medication: data,
      });
    } catch (error) {
      console.error("Error creating medication:", error);
      res.status(500).json({ error: "Failed to create medication" });
    }
  }
);

// PUT /api/medications/:id - Update a medication
router.put(
  "/:id",
  authenticateToken,
  [param("id").isUUID().withMessage("Invalid medication ID")],
  medicationValidation,
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const medicationId = req.params.id;
      const updateData = { ...req.body };

      // Parse JSON fields if they exist
      if (
        updateData.alternatives &&
        typeof updateData.alternatives === "string"
      ) {
        updateData.alternatives = JSON.parse(updateData.alternatives);
      }
      if (
        updateData.reminder_times &&
        typeof updateData.reminder_times === "string"
      ) {
        updateData.reminder_times = JSON.parse(updateData.reminder_times);
      }

      // Check if medication exists and belongs to user
      const { data: existingMedication, error: checkError } =
        await supabaseAdmin
          .from("medications")
          .select("_id")
          .eq("_id", medicationId)
          .eq("user_id", userId)
          .single();

      if (checkError || !existingMedication) {
        return res.status(404).json({ error: "Medication not found" });
      }

      const { data, error } = await supabaseAdmin
        .from("medications")
        .update(updateData)
        .eq("_id", medicationId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;

      res.json({
        message: "Medication updated successfully",
        medication: data,
      });
    } catch (error) {
      console.error("Error updating medication:", error);
      res.status(500).json({ error: "Failed to update medication" });
    }
  }
);

// PATCH /api/medications/:id/toggle-active - Toggle medication active status
router.patch(
  "/:id/toggle-active",
  authenticateToken,
  [param("id").isUUID().withMessage("Invalid medication ID")],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const medicationId = req.params.id;

      // Get current status
      const { data: currentMedication, error: fetchError } = await supabaseAdmin
        .from("medications")
        .select("is_active")
        .eq("_id", medicationId)
        .eq("user_id", userId)
        .single();

      if (fetchError || !currentMedication) {
        return res.status(404).json({ error: "Medication not found" });
      }

      // Toggle status
      const { data, error } = await supabaseAdmin
        .from("medications")
        .update({ is_active: !currentMedication.is_active })
        .eq("_id", medicationId)
        .eq("user_id", userId)
        .select()
        .single();

      if (error) throw error;

      res.json({
        message: `Medication ${
          data.is_active ? "activated" : "deactivated"
        } successfully`,
        medication: data,
      });
    } catch (error) {
      console.error("Error toggling medication status:", error);
      res.status(500).json({ error: "Failed to toggle medication status" });
    }
  }
);

// DELETE /api/medications/:id - Delete a medication
router.delete(
  "/:id",
  authenticateToken,
  [param("id").isUUID().withMessage("Invalid medication ID")],
  validateRequest,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const medicationId = req.params.id;

      // Check if medication exists and belongs to user
      const { data: existingMedication, error: checkError } =
        await supabaseAdmin
          .from("medications")
          .select("_id, name")
          .eq("_id", medicationId)
          .eq("user_id", userId)
          .single();

      if (checkError || !existingMedication) {
        return res.status(404).json({ error: "Medication not found" });
      }

      const { error } = await supabaseAdmin
        .from("medications")
        .delete()
        .eq("_id", medicationId)
        .eq("user_id", userId);

      if (error) throw error;

      res.json({
        message: `Medication "${existingMedication.name}" deleted successfully`,
      });
    } catch (error) {
      console.error("Error deleting medication:", error);
      res.status(500).json({ error: "Failed to delete medication" });
    }
  }
);

// GET /api/medications/stats/summary - Get medication statistics
router.get("/stats/summary", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get overall stats
    const { data: allMedications, error: allError } = await supabaseAdmin
      .from("medications")
      .select("is_active, category, cost")
      .eq("user_id", userId);

    if (allError) throw allError;

    const stats = {
      total: allMedications.length,
      active: allMedications.filter((med) => med.is_active).length,
      inactive: allMedications.filter((med) => !med.is_active).length,
      total_cost: allMedications.reduce(
        (sum, med) => sum + (parseFloat(med.cost) || 0),
        0
      ),
      categories: {},
    };

    // Calculate category breakdown
    allMedications.forEach((med) => {
      if (med.category) {
        stats.categories[med.category] =
          (stats.categories[med.category] || 0) + 1;
      }
    });

    res.json({ stats });
  } catch (error) {
    console.error("Error fetching medication stats:", error);
    res.status(500).json({ error: "Failed to fetch medication statistics" });
  }
});

// GET /api/medications/reminders/today - Get today's medication reminders
router.get("/reminders/today", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from("medications")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .not("reminder_times", "is", null);

    if (error) throw error;

    // Process reminders for today
    const today = new Date();
    const todaysReminders = [];

    data?.forEach((medication) => {
      if (
        medication.reminder_times &&
        Array.isArray(medication.reminder_times)
      ) {
        medication.reminder_times.forEach((time) => {
          todaysReminders.push({
            medication_id: medication._id,
            medication_name: medication.name,
            dosage: medication.dosage,
            time: time,
            instructions: medication.instructions,
          });
        });
      }
    });

    // Sort by time
    todaysReminders.sort((a, b) => a.time.localeCompare(b.time));

    res.json({
      reminders: todaysReminders,
      date: today.toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Error fetching today's reminders:", error);
    res.status(500).json({ error: "Failed to fetch today's reminders" });
  }
});

module.exports = router;
