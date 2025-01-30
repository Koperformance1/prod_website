// client/src/components/ProjectForm.js
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function ProjectForm({ project, onSubmit, onCancel }) {
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        title: project?.title || '',
        description: project?.description || '',
        technologies: project?.technologies?.join(', ') || '',
        githubUrl: project?.githubUrl || '',
        liveUrl: project?.liveUrl || '',
        completedAt: project?.completedAt?.split('T')[0] || ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const projectData = {
            ...formData,
            technologies: formData.technologies.split(',').map(tech => tech.trim())
        };

        onSubmit(projectData);
    };

    return (
        <div style={styles.formContainer}>
            <h2>{project ? 'Edit Project' : 'Add New Project'}</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.inputGroup}>
                    <label>Title</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label>Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                        required
                        style={{...styles.input, height: '100px'}}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label>Technologies (comma-separated)</label>
                    <input
                        type="text"
                        value={formData.technologies}
                        onChange={(e) => setFormData({...formData, technologies: e.target.value})}
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label>GitHub URL</label>
                    <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label>Live URL</label>
                    <input
                        type="url"
                        value={formData.liveUrl}
                        onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
                        style={styles.input}
                    />
                </div>

                <div style={styles.inputGroup}>
                    <label>Completion Date</label>
                    <input
                        type="date"
                        value={formData.completedAt}
                        onChange={(e) => setFormData({...formData, completedAt: e.target.value})}
                        required
                        style={styles.input}
                    />
                </div>

                <div style={styles.buttonGroup}>
                    <button type="submit" style={styles.submitButton}>
                        {project ? 'Update Project' : 'Add Project'}
                    </button>
                    <button type="button" onClick={onCancel} style={styles.cancelButton}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

const styles = {
    formContainer: {
        padding: '2rem',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    input: {
        padding: '0.5rem',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '1rem'
    },
    buttonGroup: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1rem'
    },
    submitButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#0066cc',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    cancelButton: {
        padding: '0.5rem 1rem',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    }
};

export default ProjectForm;