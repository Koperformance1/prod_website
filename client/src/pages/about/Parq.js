import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PARQForm = () => {
  const [formData, setState] = useState({
    name: '',
    email: '',
    date: '',
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
    q6: '',
    q7: '',
    signature: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);

  // Load reCAPTCHA script
  useEffect(() => {
    // Remove any existing reCAPTCHA scripts first
    const existingScripts = document.querySelectorAll('script[src*="recaptcha"]');
    existingScripts.forEach(script => script.remove());

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=explicit`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      console.log('reCAPTCHA script loaded');
      // Render the reCAPTCHA widget after script loads
      if (window.grecaptcha && window.grecaptcha.render) {
        try {
          window.grecaptcha.render('recaptcha-container', {
            sitekey: process.env.REACT_APP_RECAPTCHA_SITE_KEY,
            theme: 'dark',
            callback: (token) => {
              console.log('reCAPTCHA completed');
              setCaptchaToken(token);
              setError('');
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired');
              setCaptchaToken(null);
            }
          });
        } catch (err) {
          console.error('Error rendering reCAPTCHA:', err);
        }
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      const scripts = document.querySelectorAll('script[src*="recaptcha"]');
      scripts.forEach(script => script.remove());
      
      // Remove reCAPTCHA badge
      const badge = document.querySelector('.grecaptcha-badge');
      if (badge && badge.parentNode) {
        badge.parentNode.remove();
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submit triggered');
    console.log('Captcha token:', captchaToken);
    
    // Validate CAPTCHA
    if (!captchaToken) {
      setError('Please complete the CAPTCHA verification.');
      return;
    }
    
    // Validate that all questions have been answered
    const questionFields = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'];
    const unanswered = questionFields.filter(q => formData[q] === '');
    
    if (unanswered.length > 0) {
      setError('Please answer all health questions before submitting.');
      return;
    }
    
    try {
      console.log('Sending form data...');
      const response = await axios.post('/api/parq-submission', {
        ...formData,
        captchaToken
      });
      
      console.log('Response:', response.data);
      setSubmitted(true);
      setError('');
    } catch (err) {
      console.error('Submission error:', err);
      setError('There was an error submitting your form. Please try again.');
      
      // Reset CAPTCHA on error
      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
      setCaptchaToken(null);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto my-12 p-6 bg-green-50 border border-green-200 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-green-700 mb-4">Thank you for submitting your PAR-Q form!</h2>
        <p className="text-green-600">Your information has been recorded.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-black rounded-lg shadow-md border-2 border-white">
      <h1 className="text-2xl font-bold text-center text-white mb-6">Physical Activity Readiness Questionnaire (PAR-Q)</h1>
      
      <div className="mb-8 bg-black p-4 rounded-md border-2 border-white">
        <p className="mb-3 text-sm text-white">
          Regular physical activity is fun and healthy, and increasingly more people are starting to become more active every day. 
          Being more active is very safe for most people. However, some people should check with their doctor before they start becoming much more physically active.
        </p>
        <p className="text-sm text-white">
          If you are planning to become much more physically active than you are now, start by answering the seven questions below. 
          If you are between the ages of 15 and 69, the PAR-Q will tell you if you should check with your doctor before you start. 
          If you are over 69 years of age, and you are not used to being very active, check with your doctor.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="form-group">
            <label htmlFor="name" className="block text-sm font-medium text-white mb-1">Full Name:</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email:</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="form-group">
            <label htmlFor="date" className="block text-sm font-medium text-white mb-1">Date:</label>
            <input 
              type="date" 
              id="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              required 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* All your question fields - keep them exactly as they are */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Please read the questions carefully and answer each one honestly:</h2>
          
          {/* ... keep all your existing question divs ... */}
          
        </div>

        <div className="mb-8 border-t border-b border-gray-200 py-6">
          {/* ... keep your existing instructions ... */}
        </div>

        <div className="mb-8">
          <label htmlFor="signature" className="block text-sm font-medium text-white mb-2">Electronic Signature (type your full name):</label>
          <input 
            type="text" 
            id="signature" 
            name="signature" 
            value={formData.signature} 
            onChange={handleChange} 
            required 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* reCAPTCHA container - changed from data attributes to div with id */}
        <div className="mb-6 flex justify-center">
          <div id="recaptcha-container"></div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit Form
        </button>
      </form>
    </div>
  );
};

export default PARQForm;