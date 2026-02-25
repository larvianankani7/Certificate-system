const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

module.exports = function generatePDF(cert) {
  return new Promise((resolve, reject) => {
    try {
      const dir = path.join(__dirname, "..", "certificates");
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const filePath = path.join(dir, `${cert.certificateId}.pdf`);
      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 50
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      const pageWidth = doc.page.width;
      const pageHeight = doc.page.height;

      // Background
      doc.rect(0, 0, pageWidth, pageHeight).fill("#021a1f");

      // Border
      doc
        .lineWidth(6)
        .rect(20, 20, pageWidth - 40, pageHeight - 40)
        .stroke("#00e5ff");

      // Logo
      const logoPath = path.join(__dirname, "..", "assets", "logo.png");
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, pageWidth / 2 - 60, 40, { width: 120 });
      }

      doc.moveDown(5);

      // Title
      doc
        .fillColor("#00e5ff")
        .fontSize(34)
        .text("CERTIFICATE OF COMPLETION", {
          align: "center",
          underline: true
        });

      doc.moveDown(1.5);

      // Text
      doc
        .fillColor("#e6fbff")
        .fontSize(18)
        .text("This is to certify that", { align: "center" });

      doc.moveDown(0.8);

      doc
        .fontSize(28)
        .text(cert.studentName, {
          align: "center"
        });

      doc.moveDown(1);

      doc
        .fontSize(18)
        .text(
          `has successfully completed the ${cert.course} program conducted by CertifyX Training Authority, demonstrating professionalism and commitment.`,
          {
            align: "center",
            width: pageWidth - 200
          }
        );

      doc.moveDown(2);

      doc
        .fontSize(14)
        .text(
          `Issued on: ${new Date(cert.generatedAt).toDateString()}`,
          { align: "center" }
        );

      // Certificate ID
      doc
        .fontSize(12)
        .text(
          `Certificate ID: ${cert.certificateId}`,
          60,
          pageHeight - 100
        );

      // Signature
      const signPath = path.join(__dirname, "..", "assets", "signature.png");
      if (fs.existsSync(signPath)) {
        doc.image(signPath, pageWidth - 260, pageHeight - 160, {
          width: 160
        });
      }

      doc
        .fontSize(12)
        .text(
          "Authorized Signatory\nCertifyX Authority",
          pageWidth - 260,
          pageHeight - 80,
          { align: "right" }
        );

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};
