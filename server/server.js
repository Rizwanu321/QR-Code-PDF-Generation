const express = require("express");
const session = require("express-session");
const cors = require("cors");
const { initializeDatabase } = require("./config/db");
const authRoutes = require("./routes/auth");
const voucherRoutes = require("./routes/voucher");
const settingsRoutes = require("./routes/settings");

const app = express();

app.use(
  cors({
    origin: "https://qr-code-pdf-generation-client.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use(
  session({
    secret: "Rizwanu@321",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
    name: "sessionId",
    rolling: true,
  })
);

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});


initializeDatabase()
  .then(() => {
    app.use("/api/auth", authRoutes);
    app.use("/api/vouchers", voucherRoutes);
    app.use("/api/settings", settingsRoutes);

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        message: "Something went wrong!",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    });

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize application:", error);
    process.exit(1);
  });
