import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Calendar,
  Building,
  Award,
  Link as LinkIcon,
  Hash,
  Star
} from 'lucide-react';

const CATEGORIES = [
  'Degree & Diploma',
  'Professional Certification',
  'Academic Result & Marksheet',
  'Award & Honor',
  'Course & Training',
  'Research & Publication',
  'Extracurricular & Leadership'
];

export default function AchievementModal({ isOpen, onClose, onSave, editingItem }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Degree & Diploma',
    institution: '',
    issueDate: '',
    expiryDate: '',
    grade: '',
    credentialId: '',
    credentialUrl: '',
    description: '',
    tags: '',
    isFeatured: false,
    isVerified: true
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [removeExistingFile, setRemoveExistingFile] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        category: editingItem.category || 'Degree & Diploma',
        institution: editingItem.institution || '',
        issueDate: editingItem.issueDate ? editingItem.issueDate.split('T')[0] : '',
        expiryDate: editingItem.expiryDate ? editingItem.expiryDate.split('T')[0] : '',
        grade: editingItem.grade || '',
        credentialId: editingItem.credentialId || '',
        credentialUrl: editingItem.credentialUrl || '',
        description: editingItem.description || '',
        tags: Array.isArray(editingItem.tags) ? editingItem.tags.join(', ') : '',
        isFeatured: !!editingItem.isFeatured,
        isVerified: editingItem.isVerified !== undefined ? !!editingItem.isVerified : true
      });
      setSelectedFile(null);
      setRemoveExistingFile(false);
      setPreviewUrl(editingItem.file ? editingItem.file.url : null);
    } else {
      setFormData({
        title: '',
        category: 'Degree & Diploma',
        institution: '',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        grade: '',
        credentialId: '',
        credentialUrl: '',
        description: '',
        tags: '',
        isFeatured: false,
        isVerified: true
      });
      setSelectedFile(null);
      setPreviewUrl(null);
      setRemoveExistingFile(false);
    }
    setErrorMessage('');
  }, [editingItem, isOpen]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 25MB)
    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size cannot exceed 25 MB.');
      return;
    }

    setSelectedFile(file);
    setRemoveExistingFile(false);

    if (file.type.startsWith('image/') || file.type.includes('svg')) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setRemoveExistingFile(true);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setErrorMessage('Please provide a title for the achievement.');
      return;
    }
    if (!formData.institution.trim()) {
      setErrorMessage('Please provide the issuing institution or board.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const submissionData = new FormData();
      submissionData.append('title', formData.title.trim());
      submissionData.append('category', formData.category);
      submissionData.append('institution', formData.institution.trim());
      submissionData.append('issueDate', formData.issueDate);
      submissionData.append('expiryDate', formData.expiryDate);
      submissionData.append('grade', formData.grade.trim());
      submissionData.append('credentialId', formData.credentialId.trim());
      submissionData.append('credentialUrl', formData.credentialUrl.trim());
      submissionData.append('description', formData.description.trim());
      submissionData.append('tags', formData.tags);
      submissionData.append('isFeatured', formData.isFeatured);
      submissionData.append('isVerified', formData.isVerified);

      if (selectedFile) {
        submissionData.append('file', selectedFile);
      }
      if (removeExistingFile) {
        submissionData.append('removeFile', 'true');
      }

      await onSave(submissionData, editingItem ? editingItem.id : null);
      onClose();
    } catch (err) {
      setErrorMessage(err.message || 'Something went wrong. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {editingItem ? 'Edit Achievement & Certificate' : 'Upload Educational Achievement'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Add your degree, diploma, certification, or academic marksheet result.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Title / Qualification Name *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. B.S. in Computer Science or AWS Certified"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium text-slate-900 outline-none transition-all bg-white"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Institution & Grade/Result */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Issuing Institution / Organization *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  placeholder="e.g. Stanford University, Google, Harvard"
                  required
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400"
                />
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Grade / Score / Result (Optional)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  placeholder="e.g. CGPA 3.92/4.0, Grade A+, 94% Marks"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400"
                />
                <Award className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Issue Date & Expiry Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Issue / Completion Date
              </label>
              <input
                type="date"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium text-slate-900 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Expiry Date (Leave blank if lifetime)
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium text-slate-900 outline-none transition-all"
              />
            </div>
          </div>

          {/* Credential ID & URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Credential ID / Roll / Registration #
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="credentialId"
                  value={formData.credentialId}
                  onChange={handleInputChange}
                  placeholder="e.g. AWS-SAA-90412"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 font-mono text-xs"
                />
                <Hash className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Online Verification URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="credentialUrl"
                  value={formData.credentialUrl}
                  onChange={handleInputChange}
                  placeholder="https://credly.com/badges/... or university verify url"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400"
                />
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          </div>

          {/* Tags / Skills */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Relevant Skills / Subjects (Comma separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              placeholder="e.g. Machine Learning, Cloud Architecture, Python, Algorithms"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Summary / Key Learnings / Achievements
            </label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Write a brief overview of key projects, courses taken, honors received, or scope of the certificate..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* Document / Certificate Upload Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Certificate / Marksheet Document (PDF, PNG, JPG, SVG)
            </label>

            {/* If there's an existing file or selected file */}
            {(selectedFile || (!removeExistingFile && editingItem?.file)) ? (
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-12 h-12 rounded-xl object-cover" />
                    ) : (
                      <FileText className="w-6 h-6" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-bold text-slate-900 truncate">
                      {selectedFile ? selectedFile.name : editingItem?.file?.originalName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedFile
                        ? `${(selectedFile.size / 1024).toFixed(1)} KB (New upload)`
                        : `Existing attachment`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Remove file"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 hover:bg-indigo-50/20 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">
                  Click to select certificate or marksheet
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PDF, PNG, JPG, or SVG up to 25 MB
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Toggles: Featured & Verified */}
          <div className="pt-2 flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isVerified"
                checked={formData.isVerified}
                onChange={handleInputChange}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                Officially Verified
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-300 cursor-pointer"
              />
              <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                Feature on Top Highlights
              </span>
            </label>
          </div>

          {/* Submit Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{editingItem ? 'Update Achievement' : 'Save Achievement'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

