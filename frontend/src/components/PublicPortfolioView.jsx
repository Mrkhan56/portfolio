import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  Building,
  ExternalLink,
  Printer,
  Eye,
  ArrowLeft,
  Mail,
  MapPin,
  Sparkles
} from 'lucide-react';

export default function PublicPortfolioView({
  achievements,
  stats,
  profile,
  onExit,
  onViewDoc
}) {
  const verifiedCount = stats?.verifiedCount || 0;
  const degrees = stats?.categoryCounts?.['Degree & Diploma'] || 0;
  const certs = stats?.categoryCounts?.['Professional Certification'] || 0;

  const candidateName = profile?.fullName || "Mahfuz Khan";
  const candidateTitle = profile?.title || "Academic & Professional Credential Portfolio";
  const candidateInstitution = profile?.institution || "University of Technology & Science";
  const candidateBio = profile?.bio || "Official repository of conferrals, academic degrees, professional industry certifications, and validated marksheet results.";

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs print:hidden">
          <button
            onClick={onExit}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Management Vault</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Public Profile Live
            </span>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Profile Card / Header Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs p-6 sm:p-10 relative">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-100/50 via-sky-50/30 to-transparent rounded-bl-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 relative z-10">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 p-1 shadow-xl shadow-indigo-100 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center text-indigo-600">
                <GraduationCap className="w-14 h-14" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {candidateName}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified Scholar
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold text-slate-600 mb-2">
                <span>{candidateTitle}</span>
                {profile?.institution && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {candidateInstitution}
                    </span>
                  </>
                )}
                {profile?.location && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {profile.location}
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                {candidateBio}
              </p>

              {/* Social / Contact Links */}
              <div className="flex flex-wrap items-center gap-2.5 mt-3 pt-3 border-t border-slate-100 text-xs">
                {profile?.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <span>{profile.email}</span>
                  </a>
                )}
                {profile?.linkedin && (
                  <a
                    href={profile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-colors"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {profile?.github && (
                  <a
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors"
                  >
                    <span>GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 mt-4">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>{stats?.totalAchievements || achievements.length} Verified Credentials</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{degrees} Degrees</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-500" />
                  <span>{certs} Certifications</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Credentials Showcase Timeline / Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-slate-900">Verified Achievements &amp; Records</h2>
            <span className="text-xs font-semibold text-slate-500">
              {achievements.length} Entries Listed
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {item.category}
                    </span>
                    {item.grade && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {item.grade}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-1">{item.title}</h3>
                  <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mb-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {item.institution}
                  </p>

                  {item.description && (
                    <p className="text-xs text-slate-500 line-clamp-3 mb-3 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.map((tag, i) => (
                        <span key={i} className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.issueDate || 'Completed'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.file && (
                      <button
                        onClick={() => onViewDoc(item.file, item.title)}
                        className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Proof</span>
                      </button>
                    )}
                    {item.credentialUrl && (
                      <a
                        href={item.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        <span>Verify</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

