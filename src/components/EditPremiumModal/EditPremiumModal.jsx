import React, { useState } from 'react';
import './EditPremiumModal.css';

const EditPremiumModal = ({ isOpen, onClose, onSave, currentPlan, currentValidity }) => {
    const [planData, setPlanData] = useState({
        plan: currentPlan || '3 Months',
        validityDate: currentValidity || ''
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(planData);
        onClose();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Edit Premium Details</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Plan Duration:</label>
                        <select 
                            value={planData.plan}
                            onChange={(e) => setPlanData({...planData, plan: e.target.value})}
                        >
                            <option value="3 Months">3 Months</option>
                            <option value="6 Months">6 Months</option>
                            <option value="1 Year">1 Year</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Validity Date:</label>
                        <input 
                            type="date"
                            value={planData.validityDate}
                            onChange={(e) => setPlanData({...planData, validityDate: e.target.value})}
                            required
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="submit" className="save-btn">Save Changes</button>
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPremiumModal;
