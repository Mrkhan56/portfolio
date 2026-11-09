import React from 'react';
import { getFileUrl } from '../services/api';
import { X, Download, Printer, ExternalLink, FileText } from 'lucide-react';

export default function DocumentViewerModal({ doc, title, isOpen, onClose }) {
  if (!isOpen || !doc) return null;

  const fullUrl = getFileUrl(doc.url);
  const isPdf = doc.mimetype === 'application/pdf' || (doc.url && doc.url.toLowerCase().endsWith('.pdf'));
  const isImage = !isPdf && (doc.mimetype?.startsWith('image/') || doc.url?.match(/\.(svg|png|jpe?g|webp|gif)$/i));

  const handlePrint = () => {
    const printWindow = window.open(fullUrl, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col p-2 sm:p-6 animate-in fade-in duration-200">
      {/* Top action toolbar */}
      <div className="max-w-6xl w-full mx-auto bg-slate-900/90 text-white rounded-2xl p-3 sm:px-6 sm:py-3.5 flex items-center justify-between mb-3 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30">
            <FileText className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h3 className="text-sm sm:text-base font-bold text-white truncate">{title || 'Document Viewer'}</h3>
            <p className="text-xs text-slate-400 truncate">
              {doc.originalName || 'Attached Certificate'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Download button */}
          <a
            href={fullUrl}
            download={doc.originalName || 'certificate'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
            title="Download Document"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download</span>
          </a>

          {/* Open in new tab */}
          <a
            href={fullUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="max-w-6xl w-full mx-auto flex-1 bg-slate-900/40 rounded-3xl overflow-hidden border border-slate-800/80 flex items-center justify-center p-2 relative shadow-2xl">
        {isPdf ? (
          <iframe
            src={fullUrl}
            title={title}
            className="w-full h-full rounded-2xl bg-white border-0"
          />
        ) : isImage ? (
          <div className="w-full h-full flex items-center justify-center overflow-auto p-4">
            <img
              src={fullUrl}
              alt={title}
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl bg-white"
            />
          </div>
        ) : (
          <div className="text-center p-8 bg-slate-900 rounded-2xl border border-slate-800 max-w-md">
            <FileText className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
            <h4 className="text-lg font-bold text-white mb-2">{doc.originalName}</h4>
            <p className="text-xs text-slate-400 mb-6">
              This document type cannot be rendered inline. You can download and open it locally.
            </p>
            <a
              href={fullUrl}
              download={doc.originalName || 'document'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-600/30"
            >
              <Download className="w-4 h-4" />
              <span>Download File</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

