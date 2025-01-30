// client/src/components/Footer.js
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Facebook, Mail, Key, Instagram } from 'lucide-react';

function Footer() {
  const { isAuthenticated, logout } = useAuth();
  
  return (
    <footer className="bg-black text-white pb-4 mt-auto">
      <div className="container mx-auto px-4">
        {/* Social Links */}
        <div className="flex justify-center gap-4 mb-4">
          <a
            href="https://facebook.com/KOPerformanceNapa"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-600 transition-colors duration-300 p-2"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://instagram.com/koperformance"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-blue-600 transition-colors duration-300 p-2"
          >
            <Instagram size={24} />
          </a>
          <a
            href="mailto:Koperformance1@gmail.com"
            className="text-white hover:text-blue-600 transition-colors duration-300 p-2"
          >
            <Mail size={24} />
          </a>
        </div>

        {/* Copyright and Login Section */}
        <div className="relative flex justify-center items-center">
          {/* Copyright text - always centered */}
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} KO Performance
          </p>
          
          {/* Login/Logout - always on the right */}
          <div className="absolute right-7">
            {!isAuthenticated ? (
              <Link to="/login" className="text-gray-600 hover:text-gray-400 transition-colors duration-300">
                <Key size={24} />
              </Link>
            ) : (
              <button 
                onClick={logout} 
                className="text-gray-600 hover:text-gray-400 transition-colors duration-300"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;