// src/components/PopupAlert.js
import React from 'react';

const PopupAlert = ({ message, type, onClose }) => {
    if (!message) return null;

    return (
        <div className={`popup-alert ${type}`}>
            <span>{message}</span>
            <button onClick={onClose} className="close-btn">x</button>
        </div>
    );
};

export default PopupAlert;
