// server/routes/contact.js
const express = require('express');
const router = express.Router();
const https = require('https');
const querystring = require('querystring');
require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

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
    console.log('Contact form submission received');
    const { name, email, subject, message, captchaToken } = req.body;

    // Verify reCAPTCHA
    console.log('Verifying reCAPTCHA...');
    const isValidCaptcha = await verifyRecaptcha(captchaToken);
    console.log('reCAPTCHA valid:', isValidCaptcha);
    
    if (!isValidCaptcha) {
      return res.status(400).json({ 
        success: false, 
        message: 'CAPTCHA verification failed. Please try again.' 
      });
    }

    // Send email with Resend
    console.log('Sending email via Resend...');
    const data = await resend.emails.send({
      from: 'contact@koperformance.com',
      to: process.env.EMAIL_USER,
      subject: `Contact Page Inquiry - ${subject}`,
      reply_to: email,
      text: `
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

Submitted: ${new Date().toLocaleString()}
      `
    });

    console.log('Email sent successfully:', data);

    // IMPORTANT: Send success response back to client
    res.status(200).json({ 
      success: true,
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending email:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Response:', error.response);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send email. Please try again.' 
    });
  }
});

module.exports = router;