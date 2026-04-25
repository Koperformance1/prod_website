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

router.post('/parq-submission', async (req, res) => {
  try {
    console.log('PAR-Q form submission received');
    const { captchaToken, ...formData } = req.body;
    
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
    
    // Format email content
    const emailContent = `
PAR-Q Form Submission

Name: ${formData.name}
Email: ${formData.email}
Date: ${formData.date}

Questionnaire Responses:
Q1 (Heart condition): ${formData.q1.toUpperCase()}
Q2 (Chest pain during activity): ${formData.q2.toUpperCase()}
Q3 (Chest pain at rest): ${formData.q3.toUpperCase()}
Q4 (Balance/dizziness issues): ${formData.q4.toUpperCase()}
Q5 (Bone/joint problem): ${formData.q5.toUpperCase()}
Q6 (Blood pressure medication): ${formData.q6.toUpperCase()}
Q7 (Other reasons): ${formData.q7.toUpperCase()}

Electronic Signature: ${formData.signature}

Submitted: ${new Date().toLocaleString()}
    `;
    
    // Send email with Resend
    console.log('Sending PAR-Q email via Resend...');
    const data = await resend.emails.send({
      from: 'KO Performance <contact@koperformancenapa.com>',
      to: process.env.EMAIL_USER,
      subject: `PAR-Q Submission from ${formData.name}`,
      reply_to: formData.email,
      text: emailContent
    });

    console.log('PAR-Q email sent successfully:', data);
    
    // Send success response back to client
    res.status(200).json({ 
      success: true,
      message: 'PAR-Q form submitted successfully' 
    });
    
  } catch (error) {
    console.error('Error submitting PAR-Q form:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Response:', error.response);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit form. Please try again.' 
    });
  }
});

module.exports = router;