import React, { useState } from 'react';
import { X } from 'lucide-react';

const OfferForm = ({ offer, onSubmit, onCancel }) => {
    const [title, setTitle] = useState(offer?.title || '');
    const [body, setBody] = useState(offer?.body || '');
    const [existingImage, setExistingImage] = useState(offer?.image || '');
    const [newImageFile, setNewImageFile] = useState(null);
    const [newImagePreview, setNewImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewImageFile(file);
            setNewImagePreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveImage = () => {
        setExistingImage('');
        setNewImageFile(null);
        setNewImagePreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            title,
            body,
            existingImage,
            newImageFile
        });
    };

    const displayedImage = newImagePreview || existingImage;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl text-white font-bold mb-6">Edit Monthly Offer</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-white text-sm font-medium mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2 border rounded text-black"
                    />
                </div>

                <div>
                    <label className="block text-white text-sm font-medium mb-2">Body</label>
                    <textarea
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        required
                        rows={10}
                        className="w-full p-2 border rounded text-black"
                    />
                </div>

                <div>
                    <label className="block text-white text-sm font-medium mb-2">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full p-2 border rounded"
                    />

                    {displayedImage && (
                        <div className="relative mt-4 w-64">
                            <img
                                src={displayedImage}
                                alt="Preview"
                                className="w-full h-40 object-cover rounded"
                            />
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-red-300 border border-gray-300 rounded hover:bg-wb-100"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OfferForm;