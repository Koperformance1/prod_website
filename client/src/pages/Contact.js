// client/src/pages/Contact.js
import { useState } from 'react';
import { motion } from 'framer-motion';

function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to send message');
            
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <motion.div
            style={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
        >
            
            <h3 className="text-4xl font-bold text-center text-white pt-4 mb-8">CONTACT</h3>
            <div style={styles.contentWrapper}>
                <div style={styles.contactInfo}>
                    <div style={styles.infoItem}>
                        <div style={styles.boldItem}>
                            <h3>Phone:</h3>
                        </div>
                        <p>(707)-738-1151</p>
                    </div>
                    <div style={styles.infoItem}>
                        <div style={styles.boldItem}>
                            <h3>Email:</h3>
                        </div>
                        <p>
                            <a style={styles.makeBlue} href="mailto:Koperformance1@gmail.com">
                                koperformance1@gmail.com
                            </a>
                        </p>
                    </div>
                    <div style={styles.infoItem}>
                        <div style={styles.boldItem}>
                            <h3>Location:</h3>
                        </div>
                        <p>2497 Solano Avenue, Napa, California</p>
                    </div>
                    
                    {/* Google Maps Embed */}
                    <div style={styles.mapContainer}>
                        <iframe
                            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBDkR5j_0Gx5SsQaJleSRElQcvksoH8IEc&q=place_id:ChIJ2Z_tfPwGhYARt98abSkK6fw"
                            width="100%"
                            height="300"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Location Map"
                        ></iframe>
                    </div>
                </div>

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
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <input
                                type="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <input
                                type="text"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                required
                                style={styles.input}
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <textarea
                                placeholder="Your Message"
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                required
                                style={{...styles.input, height: '281px'}}
                            ></textarea>
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
                    </form>
                </div>
            </div>
        </motion.div>
    );
}

const styles = {
    container: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#000000'
    },
    title: {
        textAlign: 'center',
        marginBottom: '2rem',
        color: 'white'
    },
    contentWrapper: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
    },
    contactInfo: {
        backgroundColor: '#000000',
        color: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        border: '1px solid white'
    },
    infoItem: {
        marginBottom: '1.5rem'
    },
    boldItem: {
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    mapContainer: {
        marginTop: '1rem',
        height: '300px'
    },
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
    submitButton: {
        padding: '0.75rem',
        backgroundColor: '#0066cc',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
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
    makeBlue: {
        color: '#ADD8E6',
        textDecoration: 'underline'
    },
    bottomPadding: {
        paddingBottom: '10px'
    }
};

export default Contact;