import React from 'react';

type Status = 'idle' | 'generating' | 'sending' | 'success' | 'error';

interface StatusMessageProps {
    status: Status;
    message: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ status, message }) => {
    if (status === 'idle' || !message) {
        return null;
    }
    
    const baseClasses = 'mt-6 text-center p-4 rounded-lg text-sm font-medium animate-fade-up border';
    const statusClasses = {
        generating: 'bg-brand-50 text-brand-700 border-brand-100',
        sending: 'bg-brand-50 text-brand-700 border-brand-100',
        success: 'bg-green-50 text-green-700 border-green-100',
        error: 'bg-red-50 text-red-700 border-red-100',
    };
    
    const statusText = {
        generating: 'Generating...',
        sending: 'Sending...',
        success: 'Success!',
        error: 'Error',
    };

    const finalStatus = status as keyof typeof statusClasses;

    return (
        <div className={`${baseClasses} ${statusClasses[finalStatus] || ''}`}>
            <p><span className="font-bold">{statusText[finalStatus]}</span> {message}</p>
        </div>
    );
};

export default StatusMessage;