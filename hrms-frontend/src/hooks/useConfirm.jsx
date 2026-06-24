import { useState, useCallback, createContext, useContext } from 'react';
import ConfirmModal from '../components/ui/ConfirmModal';

// Confirm Context
const ConfirmContext = createContext(null);

/**
 * Confirm Provider Component
 * Wraps the app to provide promise-based confirm dialog functionality
 */
export function ConfirmProvider({ children }) {
  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: '',
    message: '',
    variant: 'info',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    resolvePromise: null
  });

  const confirm = useCallback(({ 
    title, 
    message, 
    variant = 'info',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel'
  }) => {
    return new Promise((resolve) => {
      setConfirmState({
        isOpen: true,
        title,
        message,
        variant,
        confirmLabel,
        cancelLabel,
        resolvePromise: resolve
      });
    });
  }, []);

  const handleClose = useCallback(() => {
    confirmState.resolvePromise?.(false);
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, [confirmState.resolvePromise]);

  const handleConfirm = useCallback(() => {
    confirmState.resolvePromise?.(true);
    setConfirmState((prev) => ({ ...prev, isOpen: false }));
  }, [confirmState.resolvePromise]);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title={confirmState.title}
        message={confirmState.message}
        variant={confirmState.variant}
        confirmLabel={confirmState.confirmLabel}
        cancelLabel={confirmState.cancelLabel}
      />
    </ConfirmContext.Provider>
  );
}

/**
 * Custom hook to use confirm dialog
 * Returns a function that shows a confirm modal and resolves to true/false
 * 
 * Usage:
 * const { confirm } = useConfirm();
 * const confirmed = await confirm({ 
 *   title: 'Delete Item?', 
 *   message: 'This action cannot be undone.',
 *   variant: 'danger' 
 * });
 */
export function useConfirm() {
  const context = useContext(ConfirmContext);
  
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  
  return context;
}

export default ConfirmProvider;
