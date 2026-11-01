const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors()); // Frontend ko connect karne ke liye

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verification check on server start
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Server is ready to send emails to:', process.env.EMAIL_USER);
  }
});

// Shifting Enquiry API Endpoint
app.post('/api/enquiry', async (req, res) => {
  const { name, phone, email, service, from, to, message, date } = req.body;

  // Validation
  if (!name || !phone || !from || !to) {
    return res.status(400).json({ success: false, message: 'Required fields missing' });
  }

  const mailOptions = {
    from: `"Radha Rani Cargo Website" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email || process.env.EMAIL_USER,
    subject: `🚨 New Shifting Enquiry: ${name} (${service || 'Relocation'})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2eaf2; border-radius: 12px; background: #ffffff;">
        <div style="background: #071524; padding: 15px 20px; border-radius: 8px; text-align: center;">
          <h2 style="color: #f5a01a; margin: 0; font-size: 20px;">SHREE RADHA RANI CARGO</h2>
          <p style="color: #cad8e6; margin: 4px 0 0; font-size: 13px;">Packers & Movers - Shifting Enquiry</p>
        </div>

        <h3 style="color: #071524; border-bottom: 2px solid #f5a01a; padding-bottom: 8px; margin-top: 24px;">Customer & Move Details</h3>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-top: 15px;">
          <tr style="background: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; border: 1px solid #e2eaf2; width: 35%;">Customer Name:</td>
            <td style="padding: 10px; border: 1px solid #e2eaf2;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border: 1px solid #e2eaf2;">Phone Number:</td>
            <td style="padding: 10px; border: 1px solid #e2eaf2;"><a href="tel:${phone}" style="color: #0b1c2e; font-weight: bold;">${phone}</a></td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; border: 1px solid #e2eaf2;">Email Address:</td>
            <td style="padding: 10px; border: 1px solid #e2eaf2;">${email || 'Not Provided'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border: 1px solid #e2eaf2;">Service Required:</td>
            <td style="padding: 10px; border: 1px solid #e2eaf2; color: #b07406; font-weight: bold;">${service || 'General Shifting'}</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; border: 1px solid #e2eaf2;">Pickup From:</td>
            <td style="padding: 10px; border: 1px solid #e2eaf2;">${from}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border: 1px solid #e2eaf2;">Delivery To:</td>
            <td style="padding: 10px; border: 1px solid #e2eaf2;">${to}</td>
          </tr>
          <tr style="background: #f8fafc;">
            <td style="padding: 10px; font-weight: bold; border: 1px solid #e2eaf2;">Moving Date:</td>
            <td style="padding: 10px; border: 1px solid #e2eaf2;">${date || 'Flexible'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border: 1px solid #e2eaf2;">Message / Items:</td>
            <td style="padding: 10px; border: 1px solid #e2eaf2;">${message || 'None'}</td>
          </tr>
        </table>

        <div style="margin-top: 25px; padding: 12px; background: #fff8ec; border-left: 4px solid #f5a01a; font-size: 13px; color: #6a4907;">
          💡 <strong>Action:</strong> Click on the phone number above to call the client or message them on WhatsApp immediately.
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Enquiry sent to email successfully!' });
  } catch (error) {
    console.error('Mail sending error:', error);
    res.status(500).json({ success: false, message: 'Failed to send enquiry email.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});