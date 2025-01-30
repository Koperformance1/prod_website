import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Journeys from './pages/Journeys';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Footer from './components/Footer';
import Facility from './pages/about/Facility';
import Staff from './pages/about/Staff';
import Schedule from './pages/about/Schedule';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div style={styles.appContainer}>
                    <Navbar />
                    <main style={styles.mainContent}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/about/schedule" element={<Schedule />} />
                            <Route path="/about/facility" element={<Facility />} />
                            <Route path="/about/staff" element={<Staff />} />
                            <Route path="/journeys" element={<Journeys />} />
                            <Route path="/contact" element={<Contact />} />
                            <Route path="/login" element={<Login />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </Router>
        </AuthProvider>
    );
}

const styles = {
  appContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  mainContent: {
    flex: '1',
    backgroundColor: '#000000'
  },

};

export default App;