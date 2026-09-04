import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import OfferForm from '../components/OfferForm';
import ContactFormFields from '../components/ContactFormFields';

function MonthlyOffer() {
    const [offer, setOffer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        fetchOffer();
    }, []);

    const fetchOffer = async () => {
        try {
            const response = await fetch('http://localhost:5001/api/offers');
            const data = await response.json();
            setOffer(data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch offer');
            setLoading(false);
        }
    };

    const handleUpdateOffer = async (offerData) => {
        try {
            const formData = new FormData();
            formData.append('title', offerData.title);
            formData.append('body', offerData.body);

            if (offerData.newImageFile) {
                formData.append('image', offerData.newImageFile);
            } else {
                // Tell backend to keep (or clear) the existing image
                formData.append('existingImage', offerData.existingImage || '');
            }

            const response = await fetch('http://localhost:5001/api/offers', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!response.ok) throw new Error('Failed to update offer');

            const updated = await response.json();
            setOffer(updated);
            setShowForm(false);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="text-white text-center p-8">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

    if (showForm) {
        return (
            <OfferForm
                offer={offer}
                onSubmit={handleUpdateOffer}
                onCancel={() => setShowForm(false)}
            />
        );
    }

    return (
        <motion.div
            className="p-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
        >
            {isAuthenticated && (
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600 mb-6"
                >
                    Edit This Page
                </button>
            )}

            <h3 className="text-4xl font-bold text-center text-white pt-4 mb-8">OFFERS</h3>
            <div className="bg-black text-white rounded-lg overflow-hidden border border-white">
                {offer?.image && (
                    <div className="w-full max-h-[400px] overflow-hidden">
                        <img
                            src={offer.image}
                            alt={offer.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="p-8">
                    <h1 className="text-3xl font-bold mb-6">{offer?.title}</h1>
                    <div className="text-gray-200 whitespace-pre-wrap leading-relaxed mb-8">
                        {offer?.body}
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <ContactFormFields />
            </div>
        </motion.div>
    );
}

export default MonthlyOffer;