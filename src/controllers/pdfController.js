// pdfController.js
import { PDFDocument } from 'pdf-lib';

export async function fillPdfWithApplicationData(pdfBytes, appData, applicationVariables) {
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const form = pdfDoc.getForm();

  applicationVariables.forEach((variable) => {
    const field = form.getTextField(variable);
    if (field) {
      field.setText(appData[variable] || "");
    }
  });

  const filledPdfBytes = await pdfDoc.save();
  return filledPdfBytes;
}

export async function generatePdfBlob(filledPdfBytes) {
  const blob = new Blob([filledPdfBytes], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
}
