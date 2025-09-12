const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
const { supabaseAdmin, supabaseAnon } = require("../config/supabase");
const { validateRequest } = require("../middleware/validation");

const router = express.Router();

// Register endpoint
router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("name").notEmpty().trim(),
    body("role").optional().isIn(["patient", "doctor", "pharmacy"]),
  ],
  validateRequest,
  async (req, res) => {
    try {
      const { email, password, name, role = "patient" } = req.body;

      // Create user in Supabase Auth
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        user_metadata: { name, role },
        email_confirm: true,
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      // Create user profile in database
      const { error: profileError } = await supabaseAdmin.from("users").insert({
        id: data.user.id,
        email,
        name,
        role,
        created_at: new Date().toISOString(),
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }

      res.status(201).json({
        message: "User registered successfully",
        user: {
          id: data.user.id,
          email: data.user.email,
          name,
          role,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  }
);

// Login endpoint
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  validateRequest,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      const { data, error } = await supabaseAnon.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Get user profile
      const { data: profile } = await supabaseAdmin
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();

      res.json({
        message: "Login successful",
        user: {
          id: data.user.id,
          email: data.user.email,
          name: profile?.name,
          role: profile?.role,
        },
        token: data.session.access_token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  }
);

// Logout endpoint
router.post("/logout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (token) {
      await supabaseAdmin.auth.admin.signOut(token);
    }

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
});

module.exports = router;
