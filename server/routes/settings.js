const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM Settings WHERE id = 1");
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const {
      title,
      max_expiry_days,
      voucher_width,
      voucher_height,
      title_font_size,
      text_font_size,
    } = req.body;

    await pool.execute(
      `UPDATE Settings SET 
        title = ?,
        max_expiry_days = ?,
        voucher_width = ?,
        voucher_height = ?,
        title_font_size = ?,
        text_font_size = ?,
        last_updated = CURRENT_TIMESTAMP
      WHERE id = 1`,
      [
        title,
        max_expiry_days,
        voucher_width,
        voucher_height,
        title_font_size,
        text_font_size,
      ]
    );

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
