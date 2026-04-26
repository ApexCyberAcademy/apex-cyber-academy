/**
 * Certificate PDF Generator
 * Generates professional completion certificates for Apex Cyber Academy.
 * Uses jsPDF to create a landscape A4 certificate with gold/emerald design.
 */

import { jsPDF } from "jspdf";

interface CertificateData {
  studentName: string;
  courseTitle: string;
  certCode: string | null;
  certificateNumber: string;
  score: number;
  issuedAt: Date;
}

export function generateCertificatePDF(data: CertificateData): Buffer {
  // Landscape A4
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = 297;
  const pageHeight = 210;

  // ─── BACKGROUND ───────────────────────────────────────────
  // Dark emerald background
  doc.setFillColor(0, 26, 22); // #001A16
  doc.rect(0, 0, pageWidth, pageHeight, "F");

  // Inner border - gold double line
  doc.setDrawColor(212, 175, 55); // #D4AF37
  doc.setLineWidth(1.5);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
  doc.setLineWidth(0.5);
  doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

  // Corner accents - small gold squares
  const cornerSize = 6;
  doc.setFillColor(212, 175, 55);
  // Top-left
  doc.rect(10, 10, cornerSize, cornerSize, "F");
  // Top-right
  doc.rect(pageWidth - 10 - cornerSize, 10, cornerSize, cornerSize, "F");
  // Bottom-left
  doc.rect(10, pageHeight - 10 - cornerSize, cornerSize, cornerSize, "F");
  // Bottom-right
  doc.rect(pageWidth - 10 - cornerSize, pageHeight - 10 - cornerSize, cornerSize, cornerSize, "F");

  // ─── HEADER ───────────────────────────────────────────────
  // Academy name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(212, 175, 55); // Gold
  doc.text("APEX CERTIFICATION ACADEMY", pageWidth / 2, 32, { align: "center" });

  // Decorative line under academy name
  doc.setDrawColor(10, 107, 90); // #0A6B5A
  doc.setLineWidth(0.8);
  doc.line(pageWidth / 2 - 60, 36, pageWidth / 2 + 60, 36);

  // ─── TITLE ────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.setTextColor(232, 224, 212); // #E8E0D4
  doc.text("CERTIFICATE", pageWidth / 2, 52, { align: "center" });

  doc.setFontSize(14);
  doc.setTextColor(196, 185, 168); // #C4B9A8
  doc.text("OF COMPLETION", pageWidth / 2, 60, { align: "center" });

  // ─── DECORATIVE DIVIDER ───────────────────────────────────
  doc.setDrawColor(212, 175, 55);
  doc.setLineWidth(0.3);
  doc.line(pageWidth / 2 - 80, 66, pageWidth / 2 - 10, 66);
  doc.line(pageWidth / 2 + 10, 66, pageWidth / 2 + 80, 66);
  // Center diamond
  doc.setFillColor(212, 175, 55);
  const cx = pageWidth / 2;
  const cy = 66;
  const ds = 3;
  doc.triangle(cx, cy - ds, cx + ds, cy, cx, cy + ds, "F");
  doc.triangle(cx, cy - ds, cx - ds, cy, cx, cy + ds, "F");

  // ─── PRESENTED TO ─────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(196, 185, 168);
  doc.text("This certificate is proudly presented to", pageWidth / 2, 78, { align: "center" });

  // ─── STUDENT NAME ─────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(212, 175, 55); // Gold
  doc.text(data.studentName, pageWidth / 2, 94, { align: "center" });

  // Underline under name
  const nameWidth = doc.getTextWidth(data.studentName);
  doc.setDrawColor(10, 107, 90);
  doc.setLineWidth(0.5);
  doc.line(pageWidth / 2 - nameWidth / 2 - 5, 97, pageWidth / 2 + nameWidth / 2 + 5, 97);

  // ─── COMPLETION TEXT ──────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(196, 185, 168);
  doc.text("for successfully completing the certification preparation course", pageWidth / 2, 108, { align: "center" });

  // ─── COURSE TITLE ─────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(232, 224, 212);
  doc.text(data.courseTitle, pageWidth / 2, 120, { align: "center" });

  if (data.certCode) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(10, 107, 90);
    doc.text(`Exam Code: ${data.certCode}`, pageWidth / 2, 128, { align: "center" });
  }

  // ─── SCORE ────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(212, 175, 55);
  doc.text(`Final Exam Score: ${data.score}%`, pageWidth / 2, 140, { align: "center" });

  // Score badge
  if (data.score >= 90) {
    doc.setFontSize(10);
    doc.setTextColor(232, 224, 212);
    doc.text("WITH DISTINCTION", pageWidth / 2, 147, { align: "center" });
  }

  // ─── BOTTOM SECTION ───────────────────────────────────────
  // Divider
  doc.setDrawColor(10, 107, 90);
  doc.setLineWidth(0.3);
  doc.line(30, 158, pageWidth - 30, 158);

  // Date
  const dateStr = data.issuedAt.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Left column: Date
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(196, 185, 168);
  doc.text("Date of Issue", 60, 168, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(232, 224, 212);
  doc.text(dateStr, 60, 174, { align: "center" });

  // Center column: Certificate Number
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(196, 185, 168);
  doc.text("Certificate Number", pageWidth / 2, 168, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(232, 224, 212);
  doc.text(data.certificateNumber, pageWidth / 2, 174, { align: "center" });

  // Right column: Issuer
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(196, 185, 168);
  doc.text("Issued By", pageWidth - 60, 168, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(232, 224, 212);
  doc.text("Apex Cyber Academy", pageWidth - 60, 174, { align: "center" });

  // ─── FOOTER ───────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Verify at apexcyberacademy.org/verify/${data.certificateNumber}`,
    pageWidth / 2,
    pageHeight - 16,
    { align: "center" }
  );

  // Return as Buffer
  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
