const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await pool.execute(
      "SELECT * FROM Users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length > 0) {
      req.session.user = rows[0];
      res.json({ success: true, user: { username: rows[0].username } });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res
          .status(500)
          .json({ success: false, message: "Logout failed" });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true, message: "Logged out successfully" });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get("/check", (req, res) => {
  if (req.session && req.session.user) {
    res.json({
      authenticated: true,
      user: { username: req.session.user.username },
    });
  } else {
    res.json({ authenticated: false });
  }
});

module.exports = router;
