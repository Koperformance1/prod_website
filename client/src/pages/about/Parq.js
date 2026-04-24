import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const PARQForm = () => {
  console.log('PARQForm component rendered');
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
  const recaptchaRef = useRef(null);
  const widgetIdRef = useRef(null);

  // Load reCAPTCHA script
  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="recaptcha/api.js"]');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Define global callback for reCAPTCHA
    window.onRecaptchaLoad = () => {
      console.log('reCAPTCHA loaded, ready to render');
      renderRecaptcha();
    };

    // If grecaptcha is already available, render immediately
    if (window.grecaptcha && window.grecaptcha.render) {
      renderRecaptcha();
    }

    return () => {
      // Cleanup
      if (widgetIdRef.current !== null && window.grecaptcha) {
        try {
          window.grecaptcha.reset(widgetIdRef.current);
        } catch (e) {
          console.log('Error resetting reCAPTCHA:', e);
        }
      }
    };
  }, []);

  const renderRecaptcha = () => {
    if (recaptchaRef.current && window.grecaptcha && window.grecaptcha.render) {
      // Only render if not already rendered
      if (widgetIdRef.current === null) {
        try {
          widgetIdRef.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: process.env.REACT_APP_RECAPTCHA_SITE_KEY,
            theme: 'dark',
            callback: (token) => {
              console.log('reCAPTCHA completed, token received');
              setCaptchaToken(token);
              setError('');
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired');
              setCaptchaToken(null);
            },
            'error-callback': () => {
              console.log('reCAPTCHA error');
              setCaptchaToken(null);
              setError('reCAPTCHA error. Please refresh the page and try again.');
            }
          });
          console.log('reCAPTCHA widget rendered with ID:', widgetIdRef.current);
        } catch (err) {
          console.error('Error rendering reCAPTCHA:', err);
        }
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION STARTED ===');
    console.log('1. Form data:', formData);
    console.log('2. Captcha token exists:', !!captchaToken);
    console.log('3. Captcha token value:', captchaToken);
    console.log('4. Widget ID:', widgetIdRef.current);
    
    // Check if reCAPTCHA response exists
    if (window.grecaptcha && widgetIdRef.current !== null) {
      try {
        const response = window.grecaptcha.getResponse(widgetIdRef.current);
        console.log('5. grecaptcha.getResponse():', response);
        
        // If we have a response but captchaToken is null, update it
        if (response && !captchaToken) {
          console.log('6. Found token via getResponse, updating state');
          setCaptchaToken(response);
          // Wait a moment for state to update, then try again
          setTimeout(() => {
            console.log('7. Retrying submission with token');
            handleSubmit(e);
          }, 100);
          return;
        }
      } catch (err) {
        console.error('Error getting reCAPTCHA response:', err);
      }
    }
    
    // Validate CAPTCHA
    if (!captchaToken) {
      console.log('8. NO CAPTCHA TOKEN - showing error');
      setError('Please complete the CAPTCHA verification before submitting.');
      return;
    }
    
    console.log('9. Captcha validated, checking questions...');
    
    // Validate that all questions have been answered
    const questionFields = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'];
    const unanswered = questionFields.filter(q => formData[q] === '');
    
    if (unanswered.length > 0) {
      console.log('10. Unanswered questions:', unanswered);
      setError('Please answer all health questions before submitting.');
      return;
    }
    
    console.log('11. All validations passed, submitting to server...');
    
    try {
      const payload = {
        ...formData,
        captchaToken
      };
      console.log('12. Payload:', payload);
      
      const response = await axios.post('/api/parq-submission', payload);
      
      console.log('13. Server response:', response.data);
      setSubmitted(true);
      setError('');
    } catch (err) {
      console.error('14. Submission error:', err);
      console.error('15. Error response:', err.response?.data);
      
      setError(err.response?.data?.message || 'There was an error submitting your form. Please try again.');
      
      // Reset CAPTCHA on error
      if (window.grecaptcha && widgetIdRef.current !== null) {
        console.log('16. Resetting reCAPTCHA');
        window.grecaptcha.reset(widgetIdRef.current);
        setCaptchaToken(null);
      }
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

const testClick = () => {
  console.log('TEST BUTTON CLICKED');
};


  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-black rounded-lg shadow-md border-2 border-white">
      <button onClick={testClick} type="button" className="bg-red-500 text-white p-2 mb-4">
        TEST CLICK
      </button>
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

        
      <form onSubmit={(e) => {
          console.log('FORM ONSUBMIT TRIGGERED');
          handleSubmit(e);
        }}>
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
            {/* All your existing question blocks - keep them as is */}
            <div className="p-3 bg-black rounded-md border-2 border-white">
              <p className="text-sm text-white mb-2">Hawwwwws your doctor ever said that you have a heart condition and that you should only do physical activity recommended by a doctor?</p>
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
            
            {/* Q2 through Q7 - keep all your existing question blocks */}
            {/* I'm omitting them here for brevity, but keep them all */}
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

        {/* reCAPTCHA container */}
        <div className="mb-6 flex justify-center">
          <div ref={recaptchaRef}></div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          onClick={() => console.log('SUBMIT BUTTON CLICKED')}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit Form
        </button>
      </form>
    </div>
  );
};

export default PARQForm;