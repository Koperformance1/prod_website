import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import JourneyForm from '../components/JourneyForm';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

// Modal component for the image gallery
const GalleryModal = ({ journey, onClose }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) => 
            prev === journey.images.length - 1 ? 0 : prev + 1
        );
    };

    const previousImage = () => {
        setCurrentImageIndex((prev) => 
            prev === 0 ? journey.images.length - 1 : prev - 1
        );
    };

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') previousImage();
            if (e.key === 'Escape') onClose();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextImage, previousImage, onClose]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.95 }}
                className="relative bg-black p-4 sm:p-6 rounded-lg w-full max-w-4xl mx-auto my-4"
                onClick={e => e.stopPropagation()}
            >
                {/* Close button - Positioned absolutely in the top-right corner */}
                <button
                    onClick={onClose}
                    className="absolute right-2 top-2 z-50 p-2 hover:bg-gray-700 rounded-full bg-black bg-opacity-50"
                >
                    <X className="text-white w-6 h-6" />
                </button>

                {/* Title - Added padding-right to prevent overlap with close button */}
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 pr-12">{journey.title}</h2>
                
                <div className="mb-6">
                    <div className="relative">
                        <img
                            src={journey.images[currentImageIndex]}
                            alt={`${journey.title} - Image ${currentImageIndex + 1}`}
                            className="w-full h-64 sm:h-96 object-contain mb-4"
                        />
                        {journey.images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        previousImage();
                                    }}
                                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-r"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-l"
                                >
                                    <ArrowRight size={24} />
                                </button>
                                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 px-3 py-1 rounded-full text-white text-sm">
                                    {currentImageIndex + 1} / {journey.images.length}
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {journey.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                className={`h-16 sm:h-20 w-16 sm:w-20 object-cover cursor-pointer transition-all
                                    ${currentImageIndex === idx ? 'border-2 border-blue-500 scale-105' : 'opacity-70 hover:opacity-100'}`}
                                onClick={() => setCurrentImageIndex(idx)}
                            />
                        ))}
                    </div>
                </div>
                
                <div className="text-white">
                    <p className="mb-4">{journey.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {journey.technologies.map((tech, index) => (
                            <span key={index} className="bg-gray-700 px-3 py-1 rounded-full text-sm">
                                {tech}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

function Journeys() {
    const [journeys, setJourneys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedJourney, setSelectedJourney] = useState(null);

    const { isAuthenticated, token } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [editingJourney, setEditingJourney] = useState(null);

    useEffect(() => {
        fetchJourneys();
    }, []);

    const fetchJourneys = async () => {
        try {
            const response = await fetch('/api/journeys');
            const data = await response.json();
            setJourneys(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch journeys');
            setLoading(false);
        }
    };

    const handleAddJourney = async (journeyData) => {   
        try {
            const formData = new FormData();
            
            console.log('Journey Data received:', journeyData);
            
            // Append regular fields
            Object.keys(journeyData).forEach(key => {
                if (key !== 'images') {
                    if (Array.isArray(journeyData[key])) {
                        formData.append(key, JSON.stringify(journeyData[key]));
                    } else {
                        formData.append(key, journeyData[key]);
                    }
                }
            });
            
            // Handle image files
            if (journeyData.images && journeyData.images.length > 0) {
                console.log('Processing images:', journeyData.images);
                journeyData.images.forEach((image, index) => {
                    formData.append('images', image);
                    console.log(`Appended image ${index}:`, image.name);
                });
            }

            const response = await fetch('/api/journeys', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error response:', errorData);
                throw new Error(errorData.message || 'Failed to add journey');
            }
            
            const responseData = await response.json();
            console.log('Success response:', responseData);
            
            fetchJourneys();
            setShowForm(false);
        } catch (err) {
            console.error('Error in handleAddJourney:', err);
            setError(err.message);
        }
    };

    const handleEditJourney = async (journeyData) => {
        try {
            const formData = new FormData();
            
            Object.keys(journeyData).forEach(key => {
                if (key !== 'images') {
                    if (Array.isArray(journeyData[key])) {
                        formData.append(key, JSON.stringify(journeyData[key]));
                    } else {
                        formData.append(key, journeyData[key]);
                    }
                }
            });
            
            if (journeyData.images) {
                journeyData.images.forEach(image => {
                    formData.append('images', image);
                });
            }

            const response = await fetch(`/api/journeys/${editingJourney._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Failed to update journey');
            
            fetchJourneys();
            setEditingJourney(null);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteJourney = async (journeyId) => {
        if (window.confirm('Are you sure you want to delete this journey?')) {
            try {
                const response = await fetch(`/api/journeys/${journeyId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to delete journey');
                }
                
                fetchJourneys();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    if (loading) return <div>Loading journeys...</div>;
    if (error) return <div>{error}</div>;

    if (showForm || editingJourney) {
        return (
            <JourneyForm 
                journey={editingJourney}
                onSubmit={editingJourney ? handleEditJourney : handleAddJourney}
                onCancel={() => {
                    setShowForm(false);
                    setEditingJourney(null);
                }}
            />
        );
    }

    return (
        <motion.div
            className="p-8 max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            {isAuthenticated && (
                <button 
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 mb-4"
                >
                    Add New Journey
                </button>
            )}
        
        <h3 className="text-4xl font-bold text-center text-white pt-4 mb-8">JOURNEYS</h3>
            
        <div className="container pb-12 pt-1 text-white text-md px-4">
            <p>
                Every summit reached begins with a single step. <br /><br /> We believe fitness isn't just about the numbers on the weights or the scale — it's about preparing for life's greatest adventures. Whether that means hiking Machu Picchu or waking up and feeling energized and ready for the day's challenges, we can help you reach your goals.
            </p>
        </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {journeys.map((journey) => (
                    <motion.div
                        key={journey._id}
                        className="bg-black text-white rounded-lg overflow-hidden cursor-pointer border border-white"
                        whileHover={{ y: -5, boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}
                        transition={{ duration: 0.2 }}
                        onClick={() => setSelectedJourney(journey)}
                    >
                        {journey.images && journey.images.length > 0 && (
                            <div className="h-48 w-full">
                                <img
                                    src={journey.images[0]}
                                    alt={journey.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        
                        <div className="p-4">
                            <h2 className="text-xl font-bold mb-2">{journey.title}</h2>
                            <p className="text-gray-400 mb-4 line-clamp-2">{journey.description}</p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                {journey.technologies.map((tech, index) => (
                                    <span key={index} className="bg-gray-800 px-2 py-1 rounded-full text-sm">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {isAuthenticated && (
                                <div className="flex gap-2 mt-4">
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingJourney(journey);
                                        }}
                                        className="px-3 py-1 bg-yellow-500 text-black rounded hover:bg-yellow-600"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteJourney(journey._id);
                                        }}
                                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedJourney && (
                    <GalleryModal 
                        journey={selectedJourney} 
                        onClose={() => setSelectedJourney(null)} 
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default Journeys;