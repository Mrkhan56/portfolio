import React from 'react';
import { Award, BookOpen, CheckCircle2, FileText, Medal, ShieldCheck } from 'lucide-react';

export default function StatsOverview({ stats, achievements }) {
  if (!stats) return null;

  const total = stats.totalAchievements || achievements.length || 0;
  const verified = stats.verifiedCount || 0;
  const degrees = stats.categoryCounts?.['Degree & Diploma'] || 0;
  const certs = stats.categoryCounts?.['Professional Certification'] || 0;
  const results = stats.categoryCounts?.['Academic Result & Marksheet'] || 0;
  const awards = stats.categoryCounts?.['Award & Honor'] || 0;

  const statCards = [
    {
      title: 'Total Credentials',
      value: total,
      subtext: `${verified} officially verified`,
      icon: Award,
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-indigo-50/60',
      textColor: 'text-indigo-600'
    },
    {
      title: 'Degrees & Diplomas',
      value: degrees,
      subtext: 'University conferrals',
      icon: BookOpen,
      color: 'from-emerald-600 to-teal-600',
      bgColor: 'bg-emerald-50/60',
      textColor: 'text-emerald-600'
    },
    {
      title: 'Certifications',
      value: certs,
      subtext: 'Industry validated badges',
      icon: ShieldCheck,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50/60',
      textColor: 'text-amber-600'
    },
    {
      title: 'Results & Marksheets',
      value: results,
      subtext: 'Official grades & scores',
      icon: FileText,
      color: 'from-purple-600 to-pink-600',
      bgColor: 'bg-purple-50/60',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs sm:text-sm font-medium text-slate-500">{card.title}</span>
              <div className={`w-9 h-9 rounded-xl ${card.bgColor} ${card.textColor} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
                {card.subtext}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

