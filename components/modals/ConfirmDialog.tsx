/**
 * ConfirmDialog Component
 * Reusable confirmation dialog
 */

import React from 'react';
import { Button } from '../shared/Button';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-xl shadow-2xl max-w-md w-full pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
            <p className="text-gray-600 mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={onCancel}>
                {cancelLabel}
              </Button>
              <Button variant={variant} onClick={onConfirm}>
                {confirmLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<Omit<ConfirmDialogProps, 'isOpen' | 'onConfirm' | 'onCancel'>>({
    title: '',
    message: '',
  });
  const resolveRef = React.useRef<((value: boolean) => void) | null>(null);

  const confirm = (dialogConfig: Omit<ConfirmDialogProps, 'isOpen' | 'onConfirm' | 'onCancel'>): Promise<boolean> => {
    setConfig(dialogConfig);
    setIsOpen(true);
    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const handleConfirm = () => {
    resolveRef.current?.(true);
    setIsOpen(false);
  };

  const handleCancel = () => {
    resolveRef.current?.(false);
    setIsOpen(false);
  };

  const dialog = (
    <ConfirmDialog
      isOpen={isOpen}
      {...config}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirm, dialog };
}
