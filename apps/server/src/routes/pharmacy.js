const express = require("express");
const { body, param, query } = require("express-validator");
const { supabaseAdmin } = require("../config/supabase");
const { authenticateToken, requireRole } = require("../middleware/auth");
const { validateRequest } = require("../middleware/validation");

const router = express.Router();

// Get available medications
router.get(
  "/medications",
  [
    query("search").optional().trim(),
    query("category").optional().trim(),
    query("limit").optional().isInt({ min: 1, max: 100 }),
  ],
  validateRequest,
  async (req, res) => {
    try {
      let query = supabaseAdmin.from("medications").select("*");

      if (req.query.search) {
        query = query.or(
          `name.ilike.%${req.query.search}%,description.ilike.%${req.query.search}%`
        );
      }

      if (req.query.category) {
        query = query.eq("category", req.query.category);
      }

      const limit = parseInt(req.query.limit) || 50;
      query = query.limit(limit);

      const { data, error } = await query.order("name");

      if (error) throw error;

      res.json({
        medications: data || [],
        count: data?.length || 0,
      });
    } catch (error) {
      console.error("Error fetching medications:", error);
      res.status(500).json({ error: "Failed to fetch medications" });
    }
  }
);

// Get user's prescriptions
router.get("/prescriptions", authenticateToken, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("prescriptions")
      .select(
        `
        *,
        medication:medications(id, name, dosage_form, strength),
        prescribed_by:users!prescriptions_prescribed_by_fkey(id, name)
      `
      )
      .eq("patient_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      prescriptions: data || [],
      count: data?.length || 0,
    });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    res.status(500).json({ error: "Failed to fetch prescriptions" });
  }
});

// Create prescription (doctors only)
router.post(
  "/prescriptions",
  [
    body("patient_id").isUUID(),
    body("medication_id").isUUID(),
    body("dosage").notEmpty().trim(),
    body("frequency").notEmpty().trim(),
    body("duration").notEmpty().trim(),
    body("instructions").optional().trim(),
    body("refills").optional().isInt({ min: 0 }),
  ],
  validateRequest,
  authenticateToken,
  requireRole(["doctor"]),
  async (req, res) => {
    try {
      // Verify patient exists
      const { data: patient, error: patientError } = await supabaseAdmin
        .from("users")
        .select("id")
        .eq("id", req.body.patient_id)
        .eq("role", "patient")
        .single();

      if (patientError || !patient) {
        return res.status(400).json({ error: "Invalid patient ID" });
      }

      // Verify medication exists
      const { data: medication, error: medicationError } = await supabaseAdmin
        .from("medications")
        .select("id")
        .eq("id", req.body.medication_id)
        .single();

      if (medicationError || !medication) {
        return res.status(400).json({ error: "Invalid medication ID" });
      }

      const prescriptionData = {
        ...req.body,
        prescribed_by: req.user.id,
        status: "active",
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from("prescriptions")
        .insert(prescriptionData)
        .select(
          `
        *,
        medication:medications(id, name, dosage_form, strength),
        patient:users!prescriptions_patient_id_fkey(id, name, email)
      `
        )
        .single();

      if (error) throw error;

      res.status(201).json({
        message: "Prescription created successfully",
        prescription: data,
      });
    } catch (error) {
      console.error("Error creating prescription:", error);
      res.status(500).json({ error: "Failed to create prescription" });
    }
  }
);

// Get nearby pharmacies
router.get(
  "/nearby",
  [
    query("lat").isFloat(),
    query("lng").isFloat(),
    query("radius").optional().isFloat({ min: 1, max: 50 }),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { lat, lng, radius = 10 } = req.query;

      // This would typically use PostGIS or similar for geo queries
      // For now, we'll return all pharmacies and let the client handle distance
      const { data, error } = await supabaseAdmin
        .from("pharmacies")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;

      // Simple distance calculation (in a real app, use proper geo queries)
      const pharmaciesWithDistance =
        data
          ?.map((pharmacy) => {
            const distance = calculateDistance(
              lat,
              lng,
              pharmacy.latitude,
              pharmacy.longitude
            );
            return { ...pharmacy, distance };
          })
          .filter((pharmacy) => pharmacy.distance <= radius)
          .sort((a, b) => a.distance - b.distance) || [];

      res.json({
        pharmacies: pharmaciesWithDistance,
        count: pharmaciesWithDistance.length,
      });
    } catch (error) {
      console.error("Error fetching nearby pharmacies:", error);
      res.status(500).json({ error: "Failed to fetch nearby pharmacies" });
    }
  }
);

// Track medication adherence
router.post(
  "/adherence",
  [
    body("prescription_id").isUUID(),
    body("taken_at").isISO8601(),
    body("taken").isBoolean(),
    body("notes").optional().trim(),
  ],
  validateRequest,
  authenticateToken,
  async (req, res) => {
    try {
      // Verify prescription belongs to user
      const { data: prescription, error: prescriptionError } =
        await supabaseAdmin
          .from("prescriptions")
          .select("id, patient_id")
          .eq("id", req.body.prescription_id)
          .eq("patient_id", req.user.id)
          .single();

      if (prescriptionError || !prescription) {
        return res.status(400).json({ error: "Invalid prescription ID" });
      }

      const adherenceData = {
        ...req.body,
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseAdmin
        .from("medication_adherence")
        .insert(adherenceData)
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({
        message: "Adherence recorded successfully",
        adherence: data,
      });
    } catch (error) {
      console.error("Error recording adherence:", error);
      res.status(500).json({ error: "Failed to record adherence" });
    }
  }
);

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in kilometers
  return d;
}

module.exports = router;
