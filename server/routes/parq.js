const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const https = require('https');
const querystring = require('querystring');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Add the missing verifyRecaptcha function using Node.js built-in modules
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
    const { captchaToken, ...formData } = req.body;
    
    // Verify reCAPTCHA
    const isValidCaptcha = await verifyRecaptcha(captchaToken);
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
    
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, 
      subject: `PAR-Q Submission from ${formData.name}`,
      text: emailContent
    });
    
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error submitting PAR-Q form:', error);
    res.status(500).json({ success: false, message: 'Failed to submit form' });
  }
});

module.exports = router;




// const express = require('express');
// const router = express.Router();
// const nodemailer = require('nodemailer');
// require('dotenv').config();


// const transporter = nodemailer.createTransport({
//     service: 'gmail', 
//     secure: false,
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//     }
// });

// router.post('/parq-submission', async (req, res) => {
//     console.log('Route hit'); 
//   try {
//     const formData = req.body;      
    
//     const emailContent = `
//       PAR-Q Form Submission
      
//       Name: ${formData.name}
//       Email: ${formData.email}
//       Date: ${formData.date}
      
//       Questionnaire Responses:
//       Q1 (Heart condition): ${formData.q1}
//       Q2 (Chest pain during activity): ${formData.q2}
//       Q3 (Chest pain at rest): ${formData.q3}
//       Q4 (Balance/dizziness issues): ${formData.q4}
//       Q5 (Bone/joint problem): ${formData.q5}
//       Q6 (Blood pressure medication): ${formData.q6}
//       Q7 (Other reasons): ${formData.q7}
      
//       Electronic Signature: ${formData.signature}
      
//       Submitted: ${new Date().toLocaleString()}
//     `;
    
//     // Send email
//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: process.env.EMAIL_USER, 
//       subject: `PAR-Q Submission from ${formData.name}`,
//       text: emailContent
//     });

    
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.error('Error submitting PAR-Q form:', error);
//     res.status(500).json({ success: false, message: 'Failed to submit form' });
//   }
// });

// module.exports = router;