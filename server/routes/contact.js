// server/routes/contact.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const https = require('https');
const querystring = require('querystring');
require('dotenv').config();

// reCAPTCHA verification function
async function verifyRecaptcha(token) {
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify({
      secret: process.env.RECAPTCHA_SECRET_KEY,
      response: token
    });

    const options = {
      hostname: 'www.google.com',
      port: 443,
      path: '/recaptcha/api/siteverify',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.success);
        } catch (error) {
          console.error('Error parsing reCAPTCHA response:', error);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.error('reCAPTCHA verification error:', error);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

router.post('/', async (req, res) => {
    try {
        const { name, email, subject, message, captchaToken } = req.body;

        // Verify reCAPTCHA
        const isValidCaptcha = await verifyRecaptcha(captchaToken);
        if (!isValidCaptcha) {
          return res.status(400).json({ 
            success: false, 
            message: 'CAPTCHA verification failed. Please try again.' 
          });
        }

        // Create a transporter using your email service
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            replyTo: email,
            to: process.env.EMAIL_USER,
            subject: `Contact Page Inquiry - ${subject}`,
            text: `
                Name: ${name}
                Email: ${email}
                Subject: ${subject}
                Message: ${message}
                
                Submitted: ${new Date().toLocaleString()}
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

module.exports = router;