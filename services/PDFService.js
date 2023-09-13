import fs from 'fs';
import PDFDocument from 'pdfkit';
import moment from 'moment';

export const pdfService = {
  buildBugsPDF,
};

function buildBugsPDF(bugs, filename = 'PDFBugs.pdf') {
  if (!Array.isArray(bugs) || bugs.length === 0) {
    console.error('Invalid bugs array or empty array provided.');
    return;
  }
  const doc = new PDFDocument();

  // Pipe its output somewhere, like to a file or HTTP response
  doc.pipe(fs.createWriteStream(filename));

  // Set font size for the table
  doc.fontSize(12);

  // Define table column widths and positions
  const columnWidths = [90, 100, 120, 100, 170]; // Adjusted width for the "createdAt" column
  const startX = 50;
  const startY = 50;
  const lineHeight = 30;

  // Draw table header
  doc.text('Animal ID', startX, startY);
  doc.text('Name', startX + columnWidths[0], startY);
  doc.text('Description', startX + columnWidths[0] + columnWidths[1], startY);
  doc.text('Severity', startX + columnWidths[0] + columnWidths[1] + columnWidths[2], startY);
  doc.text('createdAt', startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], startY);

  // Draw horizontal lines
  doc.moveTo(startX, startY + lineHeight).lineTo(startX + sumArray(columnWidths), startY + lineHeight).stroke();

  // Iterate over bugs and add table rows
  let currentY = startY + lineHeight * 2; // Start below the header

  bugs.forEach(bug => {
    doc.text(bug._id, startX, currentY);
    doc.text(bug.title, startX + columnWidths[0], currentY);
    doc.text(bug.description, startX + columnWidths[0] + columnWidths[1], currentY);
    doc.text(String(bug.severity), startX + columnWidths[0] + columnWidths[1] + columnWidths[2], currentY);

    // Convert createdAt timestamp to formatted createdAt using moment.js
    try {
      const formattedCreatedAt = moment(bug.createdAt).format('YYYY-MM-DD HH:mm:ss');
      doc.text(formattedCreatedAt, startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], currentY);
    } catch (error) {
      console.error('Error formatting createdAt:', error);
      doc.text('Invalid createdAt', startX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], currentY);
    }

    // Draw horizontal line for the row
    doc.moveTo(startX, currentY + lineHeight).lineTo(startX + sumArray(columnWidths), currentY + lineHeight).stroke();

    currentY += lineHeight; // Move to the next row
  });

  // Finalize PDF file
  doc.end();
}

// Helper function to sum an array of numbers
function sumArray(arr) {
  return arr.reduce((acc, val) => acc + val, 0);
}
