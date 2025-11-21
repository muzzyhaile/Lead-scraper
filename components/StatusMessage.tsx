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
    
    const baseClasses = 'mt-4 text-center p-4 rounded-md text-sm';
    const statusClasses = {
        generating: 'bg-blue-900/50 text-blue-300',
        sending: 'bg-blue-900/50 text-blue-300',
        success: 'bg-green-900/50 text-green-300',
        error: 'bg-red-900/50 text-red-300',
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