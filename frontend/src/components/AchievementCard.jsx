import React from 'react';
import { getFileUrl } from '../services/api';
import {
  Award,
  Building,
  Calendar,
  ExternalLink,
  FileCheck,
  FileText,
  FileSpreadsheet,
  GraduationCap,
  MoreVertical,
  Paperclip,
  ShieldCheck,
  Trash2,
  Edit3,
  Eye,
  Download,
  Star
} from 'lucide-react';

export default function AchievementCard({
  achievement,
  onEdit,
  onDelete,
  onViewDoc,
  isPublicMode
}) {
  const {
    id,
    title,
    category,
    institution,
    issueDate,
    expiryDate,
    grade,
    credentialId,
    credentialUrl,
    description,
    tags,
    file,
    isFeatured,
    isVerified
  } = achievement;

  // Category specific styles
  const getCategoryTheme = (cat) => {
    switch (cat) {
      case 'Degree & Diploma':
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200',
          icon: GraduationCap,
          iconBg: 'bg-blue-600',
          accent: 'border-l-blue-600'
        };
      case 'Professional Certification':
        return {
          badge: 'bg-amber-50 text-amber-800 border-amber-200',
          icon: ShieldCheck,
          iconBg: 'bg-amber-600',
          accent: 'border-l-amber-600'
        };
      case 'Academic Result & Marksheet':
        return {
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          icon: FileSpreadsheet,
          iconBg: 'bg-emerald-600',
          accent: 'border-l-emerald-600'
        };
      case 'Award & Honor':
        return {
          badge: 'bg-purple-50 text-purple-700 border-purple-200',
          icon: Award,
          iconBg: 'bg-purple-600',
          accent: 'border-l-purple-600'
        };
      default:
        return {
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          icon: FileText,
          iconBg: 'bg-indigo-600',
          accent: 'border-l-indigo-600'
        };
    }
  };

  const theme = getCategoryTheme(category);
  const CategoryIcon = theme.icon;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const isImageFile = (mime) => {
    return mime && (mime.startsWith('image/') || mime.includes('svg'));
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden relative group border-l-4 ${theme.accent}`}>
      {/* Top Banner / Category & Badges */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${theme.badge}`}>
              <CategoryIcon className="w-3.5 h-3.5" />
              {category}
            </span>

            {isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified
              </span>
            )}

            {isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                Featured
              </span>
            )}
          </div>

          {/* Edit / Delete actions when not strictly in public mode */}
          {!isPublicMode && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(achievement)}
                title="Edit achievement"
                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(achievement)}
                title="Delete achievement"
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Title & Institution */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
          {title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium mt-1">
          <Building className="w-4 h-4 text-slate-400 shrink-0" />
          <span>{institution}</span>
        </div>

        {/* Date & Grade info */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 mt-2.5">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Issued: {formatDate(issueDate)}</span>
            {expiryDate && <span>• Valid to {formatDate(expiryDate)}</span>}
          </div>

          {grade && (
            <div className="inline-flex items-center px-2 py-0.5 rounded-md font-bold text-xs bg-slate-100 text-slate-800">
              {grade}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="px-5 py-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {description}
        </div>
      )}

      {/* Skill / Module Tags */}
      {tags && tags.length > 0 && (
        <div className="px-5 py-2.5 flex flex-wrap gap-1.5">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Attached Document Preview Box */}
      {file && (
        <div className="mx-5 my-2.5 rounded-xl border border-slate-200 overflow-hidden bg-slate-50/70">
          {isImageFile(file.mimetype) ? (
            <div
              onClick={() => onViewDoc(file, title)}
              className="relative aspect-video max-h-48 overflow-hidden bg-slate-950/5 cursor-pointer group/img"
            >
              <img
                src={getFileUrl(file.url)}
                alt={title}
                className="w-full h-full object-contain p-2 group-hover/img:scale-102 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 text-xs font-semibold text-slate-800 shadow-md">
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  View Certificate
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-rose-600" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-semibold text-slate-800 truncate">
                    {file.originalName || 'Attached Document'}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    PDF Document {file.size ? `• ${(file.size / 1024).toFixed(1)} KB` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onViewDoc(file, title)}
                  className="px-2.5 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                >
                  View
                </button>
                <a
                  href={getFileUrl(file.url)}
                  download={file.originalName || 'certificate'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                  title="Download Document"
                >
                  <Download className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer / Verification ID & External Link */}
      <div className="mt-auto px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          {credentialId ? (
            <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              ID: {credentialId}
            </span>
          ) : (
            <span className="text-[11px] text-slate-400">Institutional Record</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {file && (
            <button
              onClick={() => onViewDoc(file, title)}
              className="inline-flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-medium cursor-pointer"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span>Document</span>
            </button>
          )}

          {credentialUrl && (
            <a
              href={credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <span>Verify Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

