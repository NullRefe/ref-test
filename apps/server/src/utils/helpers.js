const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/**
 * Generate JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

/**
 * Hash password
 */
const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 */
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate random string
 */
const generateRandomString = (length = 32) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Format date to ISO string
 */
const formatDate = (date) => {
  return new Date(date).toISOString();
};

/**
 * Calculate age from date of birth
 */
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize user input
 */
const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input.trim().replace(/[<>]/g, "");
};

/**
 * Generate pagination metadata
 */
const getPaginationMeta = (page, limit, total) => {
  const totalPages = Math.ceil(total / limit);
  return {
    current_page: page,
    per_page: limit,
    total_items: total,
    total_pages: totalPages,
    has_next: page < totalPages,
    has_prev: page > 1,
  };
};

/**
 * Calculate medication adherence based on reminder times
 */
const calculateMedicationAdherence = (medication, takenDates = []) => {
  if (!medication.start_date || !medication.reminder_times) {
    return { adherence_rate: 0, total_doses: 0, taken_doses: 0 };
  }

  const startDate = new Date(medication.start_date);
  const endDate = medication.end_date
    ? new Date(medication.end_date)
    : new Date();
  const today = new Date();
  const actualEndDate = endDate < today ? endDate : today;

  // Calculate days between start and end
  const daysDiff =
    Math.ceil((actualEndDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  const reminderTimesPerDay = medication.reminder_times.length;
  const totalDoses = daysDiff * reminderTimesPerDay;
  const takenDoses = takenDates.length;

  return {
    adherence_rate:
      totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 0,
    total_doses: totalDoses,
    taken_doses: takenDoses,
    days_active: daysDiff,
  };
};

/**
 * Check if medication needs refill
 */
const checkMedicationRefillStatus = (medication, daysThreshold = 7) => {
  if (!medication.refills_remaining || !medication.end_date) {
    return { needs_refill: false, days_until_empty: null };
  }

  const endDate = new Date(medication.end_date);
  const today = new Date();
  const daysUntilEmpty = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

  return {
    needs_refill:
      daysUntilEmpty <= daysThreshold && medication.refills_remaining > 0,
    days_until_empty: daysUntilEmpty,
    refills_remaining: medication.refills_remaining,
  };
};

/**
 * Parse and validate reminder times
 */
const validateReminderTimes = (reminderTimes) => {
  if (!Array.isArray(reminderTimes)) {
    return { valid: false, message: "Reminder times must be an array" };
  }

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

  for (const time of reminderTimes) {
    if (!timeRegex.test(time)) {
      return {
        valid: false,
        message: `Invalid time format: ${time}. Use HH:MM format (24-hour)`,
      };
    }
  }

  return { valid: true, message: "Valid reminder times" };
};

/**
 * Generate medication dosage instructions
 */
const generateDosageInstructions = (medication) => {
  const { dosage, frequency, instructions } = medication;
  let instruction = "";

  if (dosage) instruction += `Take ${dosage}`;
  if (frequency) instruction += ` ${frequency}`;
  if (instructions) instruction += `. ${instructions}`;

  return instruction.trim() || "Follow prescribed dosage";
};

/**
 * Calculate medication cost per day
 */
const calculateDailyCost = (medication) => {
  if (!medication.cost || !medication.reminder_times) {
    return 0;
  }

  const dailyDoses = medication.reminder_times.length;
  const costPerDose = medication.cost / (medication.refills_remaining || 1);

  return Math.round(costPerDose * dailyDoses * 100) / 100; // Round to 2 decimal places
};

/**
 * Group medications by category
 */
const groupMedicationsByCategory = (medications) => {
  const grouped = {};

  medications.forEach((medication) => {
    const category = medication.category || "Uncategorized";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(medication);
  });

  return grouped;
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  generateRandomString,
  formatDate,
  calculateAge,
  isValidEmail,
  sanitizeInput,
  getPaginationMeta,
  calculateMedicationAdherence,
  checkMedicationRefillStatus,
  validateReminderTimes,
  generateDosageInstructions,
  calculateDailyCost,
  groupMedicationsByCategory,
};
