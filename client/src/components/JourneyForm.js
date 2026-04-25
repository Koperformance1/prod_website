import React, { useState } from 'react';
import { X } from 'lucide-react';

const JourneyForm = ({ journey, onSubmit, onCancel }) => {
    const [title, setTitle] = useState(journey?.title || '');
    const [description, setDescription] = useState(journey?.description || '');
    const [technologies, setTechnologies] = useState(journey?.technologies || []);
    const [githubUrl, setGithubUrl] = useState(journey?.githubUrl || '');
    const [liveUrl, setLiveUrl] = useState(journey?.liveUrl || '');
    
    // Track existing and new images separately
    const [existingImages, setExistingImages] = useState(journey?.images || []);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [newTech, setNewTech] = useState('');

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (files.length > 0) {
            setNewImageFiles(prevFiles => [...prevFiles, ...files]);
            
            // Create preview URLs for the new images
            const newPreviewUrls = files.map(file => URL.createObjectURL(file));
            setNewImagePreviews(prevPreviews => [...prevPreviews, ...newPreviewUrls]);
        }
    };

    const handleRemoveExistingImage = (index) => {
        setExistingImages(prevImages => prevImages.filter((_, i) => i !== index));
    };

    const handleRemoveNewImage = (index) => {
        setNewImageFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setNewImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    };

    const handleAddTechnology = (e) => {
        e.preventDefault();
        if (newTech.trim() && !technologies.includes(newTech.trim())) {
            setTechnologies([...technologies, newTech.trim()]);
            setNewTech('');
        }
    };

    const handleRemoveTechnology = (techToRemove) => {
        setTechnologies(technologies.filter(tech => tech !== techToRemove));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // For new journeys, just send the image files
        // For editing, send both existing and new
        const submissionData = journey ? {
            title,
            description,
            technologies,
            githubUrl,
            liveUrl,
            existingImages,
            newImages: newImageFiles
        } : {
            title,
            description,
            technologies,
            githubUrl,
            liveUrl,
            images: newImageFiles
        };
        
        console.log('Submitting form data:', submissionData);
        onSubmit(submissionData);
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl text-white font-bold mb-6">
                {journey ? 'Edit Journey' : 'Add New Journey'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm text-white font-medium mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full p-2 border rounded text-black"
                    />
                </div>

                <div>
                    <label className="block text-sm text-white font-medium mb-2">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        rows={4}
                        className="w-full p-2 border rounded text-black"
                    />
                </div>

                <div>
                    <label className="block text-sm text-white font-medium mb-2">
                        Technologies
                    </label>
                    <div className="flex gap-2 mb-2">
                        <input
                            type="text"
                            value={newTech}
                            onChange={(e) => setNewTech(e.target.value)}
                            className="flex-1 p-2 border rounded text-black"
                            placeholder="Add technology..."
                        />
                        <button
                            onClick={handleAddTechnology}
                            type="button"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {technologies.map((tech, index) => (
                            <span
                                key={index}
                                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full flex items-center gap-2"
                            >
                                {tech}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTechnology(tech)}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                        Images
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="w-full p-2 border rounded"
                    />
                    
                    <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Existing Images</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {existingImages.map((image, index) => (
                                <div key={`existing-${index}`} className="relative">
                                    <img
                                        src={image}
                                        alt={`Existing ${index + 1}`}
                                        className="w-full h-32 object-cover rounded"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveExistingImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {newImagePreviews.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-sm font-medium mb-2">New Images</h3>
                            <div className="grid grid-cols-3 gap-4">
                                {newImagePreviews.map((preview, index) => (
                                    <div key={`new-${index}`} className="relative">
                                        <img
                                            src={preview}
                                            alt={`New ${index + 1}`}
                                            className="w-full h-32 object-cover rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveNewImage(index)}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 text-white rounded hover:bg-red-400"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        {journey ? 'Update Journey' : 'Create Journey'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default JourneyForm;