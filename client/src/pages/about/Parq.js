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
    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Set up global callback function
    window.onRecaptchaSuccess = (token) => {
      setCaptchaToken(token);
      setError(''); // Clear any CAPTCHA error when user completes it
    };

    window.onRecaptchaExpired = () => {
      setCaptchaToken(null);
    };

    return () => {
      // Cleanup
      const scripts = document.querySelectorAll('script[src*="recaptcha"]');
      scripts.forEach(script => script.remove());
      delete window.onRecaptchaSuccess;
      delete window.onRecaptchaExpired;
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
      await axios.post('/api/parq-submission', {
        ...formData,
        captchaToken
      });
      setSubmitted(true);
      setError('');
    } catch (err) {
      setError('There was an error submitting your form. Please try again.');
      // Reset CAPTCHA on error
      if (window.grecaptcha) {
        window.grecaptcha.reset();
      }
      setCaptchaToken(null);
    }
  };

  const onCaptchaChange = (token) => {
    setCaptchaToken(token);
    setError(''); // Clear any CAPTCHA error when user completes it
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

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Please read the questions carefully and answer each one honestly:</h2>
          
          <div className="space-y-4">
            <div className="p-3 bg-black rounded-md border-2 border-white">
              <p className="text-sm text-white mb-2">Has your doctor ever said that you have a heart condition and that you should only do physical activity recommended by a doctor?</p>
              <div className="flex space-x-6 mt-2">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="q1" 
                    value="yes" 
                    checked={formData.q1 === 'yes'} 
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-white">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="q1" 
                    value="no" 
                    checked={formData.q1 === 'no'} 
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-white">No</span>
                </label>
              </div>
            </div>
            
            <div className="p-3 bg-black rounded-md border-2 border-white">
              <p className="text-sm text-white mb-2">Do you feel pain in your chest when you do physical activity?</p>
              <div className="flex space-x-6 mt-2">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="q2" 
                    value="yes" 
                    checked={formData.q2 === 'yes'} 
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-white">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="q2" 
                    value="no" 
                    checked={formData.q2 === 'no'} 
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-white">No</span>
                </label>
              </div>
            </div>
            
            <div className="p-3 bg-black rounded-md border-2 border-white">
              <p className="text-sm text-white mb-2">In the past month, have you had chest pain when you were not doing physical activity?</p>
              <div className="flex space-x-6 mt-2">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="q3" 
                    value="yes" 
                    checked={formData.q3 === 'yes'} 
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-white">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="q3" 
                    value="no" 
                    checked={formData.q3 === 'no'} 
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-white">No</span>
                </label>
              </div>
            </div>
            
            <div className="p-3 bg-black rounded-md border-2 border-white">
              <p className="text-sm text-white mb-2">Do you lose your balance because of dizziness or do you ever lose consciousness?</p>
              <div className="flex space-x-6 mt-2">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="q4" 
                    value="yes" 
                    checked={formData.q4 === 'yes'} 
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-white">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="q4" 
                    value="no" 
                    checked={formData.q4 === 'no'} 
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-white">No</span>
                </label>
              </div>
            </div>
            
            <div className="p-3 bg-black rounded-md border-2 border-white">
              <p className="text-sm text-white mb-2">Do you have a bone or joint problem that could be made worse by a change in your physical activity?</p>
              <div className="flex space-x-6 mt-2">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="q5" 
                    value="yes" 
                    checked={formData.q5 === 'yes'} 
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-white">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="q5" 
                    value="no" 
                    checked={formData.q5 === 'no'} 
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-white">No</span>
                </label>
              </div>
            </div>
            
            <div className="p-3 bg-black rounded-md border-2 border-white">
              <p className="text-sm text-white mb-2">Is your doctor currently prescribing drugs (for example, water pills) for your blood pressure or heart condition?</p>
              <div className="flex space-x-6 mt-2">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="q6" 
                    value="yes" 
                    checked={formData.q6 === 'yes'} 
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-white">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="q6" 
                    value="no" 
                    checked={formData.q6 === 'no'} 
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-white">No</span>
                </label>
              </div>
            </div>
            
            <div className="p-3 bg-black rounded-md border-2 border-white">
              <p className="text-sm text-white mb-2">Do you know of any other reason why you should not do physical activity?</p>
              <div className="flex space-x-6 mt-2">
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="q7" 
                    value="yes" 
                    checked={formData.q7 === 'yes'} 
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-white">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="radio" 
                    name="q7" 
                    value="no" 
                    checked={formData.q7 === 'no'} 
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-white">No</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 border-t border-b border-gray-200 py-6">
          <div className="mb-4">
            <p className="font-medium text-white mb-2">If you answered YES to one or more questions:</p>
            <ul className="list-disc pl-5 text-sm text-white space-y-1">
              <li>Talk with your doctor by phone or in person BEFORE you start becoming much more physically active or BEFORE you have a fitness appraisal.</li>
              <li>Tell your doctor about the PAR-Q and which questions you answered YES.</li>
            </ul>
          </div>
          
          <div>
            <p className="font-medium text-white mb-2">If you answered NO to all questions:</p>
            <ul className="list-disc pl-5 text-sm text-white space-y-1">
              <li>You can be reasonably sure that you can start becoming much more physically active – begin slowly and build up gradually.</li>
              <li>You may take part in a fitness appraisal – this is an excellent way to determine your basic fitness so that you can plan the best way for you to live actively.</li>
            </ul>
          </div>
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

        <div className="mb-8 flex justify-center">
          <div 
            className="g-recaptcha" 
            data-sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            data-theme="dark"
            data-callback="onRecaptchaSuccess"
            data-expired-callback="onRecaptchaExpired"
          ></div>
        <button 
          type="submit" 
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit Form
        </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
            {error}
          </div>
        )}
        
      </form>
    </div>
  );
};

export default PARQForm