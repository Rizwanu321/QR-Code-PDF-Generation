const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const { pool } = require("../config/db");

router.get("/pdf/:id", async (req, res) => {
  try {
    const [voucherRows] = await pool.execute(
      "SELECT * FROM Vouchers WHERE id = ?",
      [req.params.id]
    );

    const [settingsRows] = await pool.execute(
      "SELECT * FROM Settings WHERE id = 1"
    );

    if (voucherRows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Voucher not found" });
    }

    const voucher = voucherRows[0];
    const settings = settingsRows[0];

    const doc = new PDFDocument({
      size: [settings.voucher_width, settings.voucher_height],
      margin: 10,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=voucher-${voucher.number}.pdf`
    );

    doc.pipe(res);

    doc
      .fontSize(settings.title_font_size)
      .text(settings.title, { align: "center" });
    doc.moveDown();

    doc.fontSize(settings.text_font_size);
    doc.text(`Voucher Number: ${voucher.number}`, { align: "center" });
    doc.text(
      `Generated: ${new Date(voucher.generated_date).toLocaleDateString()}`,
      { align: "center" }
    );
    doc.text(`Expires: ${new Date(voucher.expiry_date).toLocaleDateString()}`, {
      align: "center",
    });
    doc.moveDown();

    const qrSize =
      Math.min(settings.voucher_width, settings.voucher_height) * 0.5;
    const qrX = (settings.voucher_width - qrSize) / 2;
    doc.image(
      Buffer.from(voucher.qr_code.split(",")[1], "base64"),
      qrX,
      doc.y,
      {
        fit: [qrSize, qrSize],
      }
    );

    doc.end();
  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post("/generate", async (req, res) => {
  try {
    const [settings] = await pool.execute(
      "SELECT max_expiry_days FROM Settings WHERE id = 1"
    );

    if (!settings || !settings[0]) {
      throw new Error("Settings not found");
    }

    const maxExpiryDays = settings[0].max_expiry_days;

    const voucherNumber = Math.floor(Math.random() * 9000000000) + 1000000000;

    const qrCodeData = await QRCode.toDataURL(voucherNumber.toString());

    const generatedDate = new Date();
    const expiryDate = new Date(
      generatedDate.getTime() + maxExpiryDays * 24 * 60 * 60 * 1000
    );

    await pool.execute(
      "INSERT INTO Vouchers (number, generated_date, expiry_date, qr_code) VALUES (?, ?, ?, ?)",
      [voucherNumber, generatedDate, expiryDate, qrCodeData]
    );

    res.json({
      success: true,
      voucherNumber,
      qrCodeData,
      generatedDate,
      expiryDate,
    });
  } catch (error) {
    console.error("Voucher generation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error generating voucher",
    });
  }
});

router.get("/list", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      "SELECT * FROM Vouchers ORDER BY generated_date DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Voucher list error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
