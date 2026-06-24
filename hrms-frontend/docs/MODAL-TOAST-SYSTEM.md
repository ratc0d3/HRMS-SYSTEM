# Custom Modal & Toast Notification System

This document provides complete documentation for the unified modal and toast notification system implemented across the HRMS application.

## Overview

This system replaces all native browser dialogs (`window.alert`, `window.confirm`, `window.prompt`) with a unified, reusable custom modal and toast notification system built in React + Tailwind CSS.

## Architecture

### Component Structure

```
src/
├── components/
│   └── ui/
│       ├── index.js              # Re-exports all UI components
│       ├── Modal.jsx             # Base reusable modal wrapper
│       ├── ConfirmModal.jsx      # Yes/no confirmation dialog
│       └── Toast.jsx             # Toast notification system
├── hooks/
│   └── useConfirm.jsx            # Promise-based confirm hook
└── main.jsx                      # Root providers setup
```

---

## 1. Modal Component (`components/ui/Modal.jsx`)

### Purpose
Reusable modal wrapper used across all pages/features.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | - | Controls modal visibility |
| `onClose` | function | - | Callback when modal closes |
| `title` | string \| JSX | - | Modal header title |
| `children` | JSX | - | Modal body content |
| `footer` | JSX | - | Modal footer (action buttons) |
| `size` | string | 'md' | Modal width: 'sm', 'md', 'lg' |

### Features
- Centered overlay with backdrop blur + semi-transparent dark background
- White card, rounded-xl, shadow-xl, max-w-md, fully responsive
- Closes on backdrop click and ESC key
- Focus trap while open
- Smooth open/close animation (fade + scale)
- Renders via React Portal (document.body)

### Usage Example

```jsx
import Modal from './components/ui/Modal';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Create New Employee"
      footer={
        <>
          <button onClick={() => setIsOpen(false)}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </>
      }
      size="md"
    >
      <form>
        <input type="text" placeholder="Employee name" />
      </form>
    </Modal>
  );
}
```

---

## 2. ConfirmModal Component (`components/ui/ConfirmModal.jsx`)

### Purpose
Wraps Modal.jsx for yes/no confirmation dialogs. Replaces all `window.confirm()` calls system-wide.

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | - | Controls modal visibility |
| `onClose` | function | - | Callback when cancelled |
| `onConfirm` | function | - | Callback when confirmed |
| `title` | string | - | Modal header title |
| `message` | string | - | Confirmation message |
| `confirmLabel` | string | 'Confirm' | Confirm button text |
| `cancelLabel` | string | 'Cancel' | Cancel button text |
| `variant` | string | 'info' | Variant: 'danger', 'warning', 'info' |
| `loading` | boolean | false | Shows loading spinner on confirm button |

### Variant Colors
- **danger** = Red confirm button (for delete actions)
- **warning** = Amber confirm button
- **info** = Blue confirm button

### Features
- Icon in header based on variant (trash, warning triangle, info circle)
- Loading state support on confirm button
- Consistent styling across all confirmation dialogs

### Direct Usage Example

```jsx
import { useState } from 'react';
import ConfirmModal from './components/ui/ConfirmModal';

function MyComponent() {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <button onClick={() => setShowConfirm(true)}>Delete Item</button>
      
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Employee?"
        message="This action cannot be undone. Are you sure?"
        variant="danger"
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />
    </>
  );
}
```

---

## 3. useConfirm Hook (`hooks/useConfirm.jsx`)

### Purpose
Promise-based confirmation that allows triggering confirm modals without managing open/close state.

### Usage

```jsx
import { useConfirm } from './hooks/useConfirm';

function MyComponent() {
  const { confirm } = useConfirm();

  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: 'Delete Record?',
      message: 'This action cannot be undone.',
      variant: 'danger',
      confirmLabel: 'Delete'
    });

    if (!confirmed) return;
    
    // Proceed with deletion
    await api.delete(`/records/${id}`);
    showToast('Record deleted successfully!', 'success');
  };

  return <button onClick={handleDelete}>Delete</button>;
}
```

### API

```javascript
const confirmed = await confirm({
  title: string,           // Required
  message: string,         // Required
  variant: 'danger' | 'warning' | 'info',  // Default: 'info'
  confirmLabel: string,    // Default: 'Confirm'
  cancelLabel: string      // Default: 'Cancel'
});
// Returns: true (confirmed) | false (cancelled)
```

---

## 4. Toast Notification System (`components/ui/Toast.jsx`)

### Purpose
Replaces ALL `window.alert()` success/error messages system-wide.

### Features
- Position: top-right, stacked if multiple
- Variants: success (green), error (red), warning (amber), info (blue)
- Each toast: icon + message + X dismiss button
- Auto-dismisses after 4 seconds
- Smooth slide-in from right, fade-out on dismiss
- Implemented as React Context (ToastContext)

### Usage

```jsx
import { useToast } from './components/ui/Toast';

function MyComponent() {
  const { showToast } = useToast();

  const handleSave = async () => {
    try {
      await api.post('/employees', formData);
      showToast('Employee created successfully!', 'success');
    } catch (err) {
      showToast('Failed to create employee', 'error');
    }
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### API

```javascript
showToast(message, variant, duration);

// Parameters:
// - message: string (required)
// - variant: 'success' | 'error' | 'warning' | 'info' (default: 'info')
// - duration: number (default: 4000ms, set 0 to disable auto-dismiss)

// Returns: toast ID (for manual dismissal)
```

### Manual Dismissal

```javascript
const { showToast, dismissToast } = useToast();

const toastId = showToast('Long running operation...', 'info', 0);

// Later, dismiss manually:
dismissToast(toastId);
```

---

## 5. Global Setup

### Provider Wrapping

The app root (`main.jsx`) is wrapped with both providers:

```jsx
import { ToastProvider } from './components/ui/Toast';
import { ConfirmProvider } from './hooks/useConfirm';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <ConfirmProvider>
        <App />
      </ConfirmProvider>
    </ToastProvider>
  </StrictMode>,
);
```

### Import from Single Entry Point

```jsx
import { Modal, ConfirmModal, useToast, useConfirm } from './components/ui';
```

---

## 6. Migration Patterns

### Replacing alert()

**Before:**
```jsx
alert('Operation successful!');
```

**After:**
```jsx
const { showToast } = useToast();
showToast('Operation successful!', 'success');
```

### Replacing window.confirm()

**Before:**
```jsx
if (!window.confirm('Delete this item?')) return;
await api.delete(`/items/${id}`);
```

**After:**
```jsx
const { confirm } = useConfirm();

const confirmed = await confirm({
  title: 'Delete Item?',
  message: 'Are you sure you want to delete this item?',
  variant: 'danger',
  confirmLabel: 'Delete'
});

if (!confirmed) return;
await api.delete(`/items/${id}`);
showToast('Item deleted successfully!', 'success');
```

---

## 7. Implementation Summary

### Pages Refactored

| Page | alert() | window.confirm() | Status |
|------|---------|------------------|--------|
| **Attendance.jsx** | 2 replaced | 1 replaced | ✅ Complete |
| **Employees.jsx** | 2 replaced | 0 (had custom modal) | ✅ Complete |
| **Salaries.jsx** | 1 replaced | 0 | ✅ Complete |
| **Payroll.jsx** | 2 replaced | 0 | ✅ Complete |
| Dashboard.jsx | 0 | 0 | ✅ No changes needed |
| Login.jsx | 0 | 0 | ✅ No changes needed |

### Toast Messages Added

| Page | Success Messages | Error Messages |
|------|------------------|----------------|
| Employees | Created, Updated, Deleted | Save failed, Delete failed |
| Salaries | Set, Updated | Save failed |
| Attendance | Recorded, Deleted | Save failed, Delete failed |
| Payroll | Generated | Generation failed |

---

## 8. CSS Animations

Added to `index.css`:

```css
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scale-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes slide-in-right {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-fade-in { animation: fade-in 0.2s ease-out; }
.animate-scale-in { animation: scale-in 0.2s ease-out; }
.animate-slide-in-right { animation: slide-in-right 0.3s ease-out; }
```

---

## 9. Best Practices

1. **Always use `useToast`** for user feedback instead of `alert()`
2. **Always use `useConfirm`** for confirmation dialogs instead of `window.confirm()`
3. **Use appropriate variants**:
   - `success` for successful operations
   - `error` for failures and errors
   - `warning` for important warnings
   - `info` for informational messages
4. **Use `danger` variant** for destructive actions (delete, remove)
5. **Use `warning` variant** for potentially risky actions
6. **Keep messages concise** and actionable

---

## 10. File Locations Summary

```
src/
├── components/
│   └── ui/
│       ├── index.js              # Export all UI components
│       ├── Modal.jsx             # Base modal wrapper
│       ├── ConfirmModal.jsx      # Confirmation modal
│       └── Toast.jsx             # Toast notification system
├── hooks/
│   └── useConfirm.jsx            # Promise-based confirm hook + provider
├── pages/
│   ├── Employees.jsx             # Uses useToast
│   ├── Salaries.jsx              # Uses useToast
│   ├── Attendance.jsx            # Uses useToast + useConfirm
│   └── Payroll.jsx               # Uses useToast
└── main.jsx                      # ToastProvider + ConfirmProvider
```

---

## Summary

All native browser dialogs have been successfully replaced with:
- **7 alert() calls** → `showToast()` across 4 pages
- **1 window.confirm() call** → `useConfirm()` in Attendance.jsx
- **Consistent UX** with smooth animations and proper styling
- **Reusable components** for future development

The system is production-ready and provides a unified, professional user experience throughout the HRMS application.
