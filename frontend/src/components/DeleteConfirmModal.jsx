import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, item, onClose, onConfirm, isDeleting }) {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Delete Achievement?
        </h3>
        <p className="text-sm text-slate-600 mb-2">
          Are you sure you want to delete <span className="font-semibold text-slate-900">"{item.title}"</span>?
        </p>
        <p className="text-xs text-rose-600 bg-rose-50 p-2.5 rounded-xl mb-6">
          This will permanently remove the record and any associated certificate documents from the vault.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(item.id)}
            disabled={isDeleting}
            className="px-5 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-98 rounded-xl shadow-md shadow-rose-200 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Permanently</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

