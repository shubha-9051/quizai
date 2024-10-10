const fs = require('fs');
const pdf = require('pdf-parse');

// Path to the PDF file
const filePath = "ex.pdf";

// Read the PDF file
const fileBuffer = fs.readFileSync(filePath);

// Extract text from PDF
pdf(fileBuffer).then((data) => {
  console.log('Extracted Text:', data.text);
}).catch((error) => {
  console.error('Error:', error);
});