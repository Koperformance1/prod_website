// client/src/pages/Contact.js
import { motion } from 'framer-motion';
import ContactFormFields from '../components/ContactFormFields';

function Contact() {
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

                <ContactFormFields />
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
    makeBlue: {
        color: '#ADD8E6',
        textDecoration: 'underline'
    }
};

export default Contact;