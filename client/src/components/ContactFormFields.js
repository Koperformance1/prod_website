import { useState, useEffect } from 'react';

function ContactFormFields() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('');
    const [captchaToken, setCaptchaToken] = useState(null);

    // Load reCAPTCHA script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);

        window.onRecaptchaSuccess = (token) => {
            setCaptchaToken(token);
            setStatus('');
        };

        window.onRecaptchaExpired = () => {
            setCaptchaToken(null);
        };

        return () => {
            const scripts = document.querySelectorAll('script[src*="recaptcha"]');
            scripts.forEach(script => script.remove());
            delete window.onRecaptchaSuccess;
            delete window.onRecaptchaExpired;
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!captchaToken) {
            setStatus('captcha-required');
            return;
        }

        setStatus('sending');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    captchaToken
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Failed to send message');
            }

            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setCaptchaToken(null);
            if (window.grecaptcha) {
                window.grecaptcha.reset();
            }
        } catch (error) {
            console.error('Contact form error:', error);
            setStatus('error');
            setCaptchaToken(null);
            if (window.grecaptcha) {
                window.grecaptcha.reset();
            }
        }
    };

    return (
        <div style={styles.formContainer}>
            <div style={styles.bottomPadding}>
                <h2>Send a Message</h2>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <input
                        type="text"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <input
                        type="email"
                        placeholder="Your Email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <input
                        type="text"
                        placeholder="Subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <textarea
                        placeholder="Your Message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                        style={{ ...styles.input, height: '281px' }}
                    ></textarea>
                </div>

                <div style={styles.recaptchaWrapper}>
                    <div
                        className="g-recaptcha"
                        data-sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                        data-theme="dark"
                        data-callback="onRecaptchaSuccess"
                        data-expired-callback="onRecaptchaExpired"
                    ></div>
                </div>

                <button type="submit" style={styles.submitButton}>
                    {status === 'sending' ? 'Sending...' : 'Send Message'}
                </button>

                {status === 'success' && (
                    <p style={styles.successMessage}>Message sent successfully!</p>
                )}
                {status === 'error' && (
                    <p style={styles.errorMessage}>Failed to send message. Please try again.</p>
                )}
                {status === 'captcha-required' && (
                    <p style={styles.errorMessage}>Please complete the CAPTCHA verification.</p>
                )}
            </form>
        </div>
    );
}

const styles = {
    formContainer: {
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        color: 'white',
        backgroundColor: '#000000',
        border: '1px solid white'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
    },
    input: {
        padding: '0.75rem',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '1rem',
        color: 'white',
        backgroundColor: '#000000',
    },
    recaptchaWrapper: {
        display: 'flex',
        justifyContent: 'center',
        maxWidth: '100%',
        overflow: 'hidden',
        flexDirection: 'column'
    },
    submitButton: {
        padding: '0.75rem 1.5rem',
        backgroundColor: '#0066cc',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
        whiteSpace: 'nowrap',
        flexShrink: 0
    },
    successMessage: {
        color: '#28a745',
        textAlign: 'center',
        marginTop: '1rem'
    },
    errorMessage: {
        color: '#dc3545',
        textAlign: 'center',
        marginTop: '1rem'
    },
    bottomPadding: {
        paddingBottom: '10px'
    }
};

export default ContactFormFields;