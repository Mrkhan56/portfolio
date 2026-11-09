import React from 'react';
import { Award, Plus, Eye, Share2, Printer, Sparkles, GraduationCap } from 'lucide-react';

export default function Navbar({ onOpenAddModal, isPublicMode, setIsPublicMode, totalCount }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Edu<span className="text-indigo-600">Vault</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Portfolio Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                Academic &amp; Certification Credential Showcase
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Print/Export Resume button */}
            <button
              onClick={handlePrint}
              title="Print or Export PDF"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Export PDF</span>
            </button>

            {/* Public Portfolio View Toggle */}
            <button
              onClick={() => setIsPublicMode(!isPublicMode)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg border transition-all cursor-pointer ${
                isPublicMode
                  ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Eye className="w-4 h-4 text-indigo-500" />
              <span className="hidden sm:inline">
                {isPublicMode ? 'Exit Public View' : 'Public Showcase View'}
              </span>
              <span className="sm:hidden">{isPublicMode ? 'Exit' : 'View'}</span>
            </button>

            {/* Add Achievement Button */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-98 rounded-lg shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Achievement</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

