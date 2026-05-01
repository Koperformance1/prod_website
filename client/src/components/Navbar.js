import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileAboutDropdown, setShowMobileAboutDropdown] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setShowDropdown(false);
    setShowMobileAboutDropdown(false); // Reset mobile dropdown when closing menu
  };

  const toggleMobileAboutDropdown = (e) => {
    e.preventDefault();
    setShowMobileAboutDropdown(!showMobileAboutDropdown);
  };

  return (
    <nav className="nav bg-black">
      <div className="flex justify-between items-center w-full">
        {/* Logo section */}
        <div className="logo">
          <Link to="/" className="logo-link">
            <img
              src="/images/logo.png"
              className="logoImage"
              alt="KO Performance Logo"
            />
            <span>KO PERFORMANCE</span>
          </Link>
        </div>

        {/* Desktop menu */}
        <div className="links">
          <Link
            to="/"
            className={`link ${location.pathname === '/' ? 'activeLink' : ''}`}
          >
            Home
          </Link>

          {/* About dropdown */}
          <div
            className="dropdownContainer"
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
          >
            <button 
              className={`link ${location.pathname.startsWith('/about') ? 'activeLink' : ''}`}
              onClick={(e) => e.preventDefault()}
            >
              ABOUT ▼
            </button>
            {showDropdown && (
              <div className="dropdownMenu bg-black">
                <Link to="/about/schedule" className="dropdownLink">
                  Schedule
                </Link>
                <Link to="/about/facility" className="dropdownLink">
                  Facility
                </Link>
                <Link to="/about/staff" className="dropdownLink">
                  Staff
                </Link>
                <Link to="/about/parq" className="dropdownLink">
                  PAR-Q
                </Link>
                <Link to="/contact" className="dropdownLink">
                  MTB Bike Excursions
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/journeys"
            className={`link ${location.pathname === '/journeys' ? 'activeLink' : ''}`}
          >
            Journeys
          </Link>
          <Link
            to="/contact"
            className={`link ${location.pathname === '/contact' ? 'activeLink' : ''}`}
          >
            Contact
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={toggleMobileMenu}
          className="mobile-menu-button text-white"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-8 h-8" strokeWidth={2} />
          ) : (
            <Menu className="w-8 h-8" strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <Link
          to="/"
          className={`link ${location.pathname === '/' ? 'activeLink' : ''}`}
          onClick={toggleMobileMenu}
        >
          HOME
        </Link>
        <button 
          className={`link ${location.pathname.startsWith('/about') ? 'activeLink' : ''}`}
          onClick={toggleMobileAboutDropdown}
        >
          ABOUT {showMobileAboutDropdown ? '▼' : '▶'}
        </button>
        {showMobileAboutDropdown && (
          <>
            <Link 
              to="/about/schedule" 
              className="dropdownLink pl-6"
              onClick={toggleMobileMenu}
            >
              SCHEDULE
            </Link>
            <Link 
              to="/about/facility" 
              className="dropdownLink pl-6"
              onClick={toggleMobileMenu}
            >
              FACILITY
            </Link>
            <Link 
              to="/about/staff" 
              className="dropdownLink pl-6"
              onClick={toggleMobileMenu}
            >
              STAFF
            </Link>
            <Link 
              to="/about/parq" 
              className="dropdownLink pl-6"
              onClick={toggleMobileMenu}
            >
              PAR-Q
            </Link>
          </>
        )}
        <Link
          to="/journeys"
          className={`link ${location.pathname === '/journeys' ? 'activeLink' : ''}`}
          onClick={toggleMobileMenu}
        >
          JOURNEYS
        </Link>
        <Link
          to="/contact"
          className={`link ${location.pathname === '/contact' ? 'activeLink' : ''}`}
          onClick={toggleMobileMenu}
        >
          CONTACT
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;