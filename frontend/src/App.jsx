import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsOverview from './components/StatsOverview';
import AchievementCard from './components/AchievementCard';
import AchievementModal from './components/AchievementModal';
import DocumentViewerModal from './components/DocumentViewerModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import PublicPortfolioView from './components/PublicPortfolioView';
import { api } from './services/api';
import {
  Search,
  Filter,
  Plus,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  GraduationCap,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [achievements, setAchievements] = useState([]);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date-desc');
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewingDoc, setViewingDoc] = useState(null);
  const [isPublicMode, setIsPublicMode] = useState(false);

  // Notification toast
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Fetch initial data
  const loadData = async () => {
    try {
      setIsLoading(true);
      const [achievementsData, statsData, categoriesData] = await Promise.all([
        api.getAchievements({
          category: selectedCategory,
          search: searchQuery,
          sortBy: sortBy
        }),
        api.getStats(),
        api.getCategories()
      ]);

      setAchievements(achievementsData);
      setStats(statsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to load portfolio data:', err);
      showToast('Could not reach backend server. Please verify server is running.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory, sortBy]);

  // Handle live search debounce or search submit
  useEffect(() => {
    const timer = setTimeout(() => {
      api.getAchievements({
        category: selectedCategory,
        search: searchQuery,
        sortBy: sortBy
      })
      .then(res => setAchievements(res))
      .catch(e => console.error(e));
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handlers
  const handleOpenAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (achievement) => {
    setEditingItem(achievement);
    setIsModalOpen(true);
  };

  const handleSaveAchievement = async (formData, id) => {
    if (id) {
      await api.updateAchievement(id, formData);
      showToast('Achievement successfully updated!');
    } else {
      await api.createAchievement(formData);
      showToast('New achievement & certificate uploaded!');
    }
    await loadData();
  };

  const handleDeleteAchievement = async (id) => {
    try {
      setIsDeleting(true);
      await api.deleteAchievement(id);
      showToast('Achievement deleted from vault.');
      setDeletingItem(null);
      await loadData();
    } catch (err) {
      showToast(err.message || 'Failed to delete', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewDoc = (file, title) => {
    setViewingDoc({ file, title });
  };

  if (isPublicMode) {
    return (
      <PublicPortfolioView
        achievements={achievements}
        stats={stats}
        onExit={() => setIsPublicMode(false)}
        onViewDoc={handleViewDoc}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 border text-sm font-semibold ${
              notification.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        onOpenAddModal={handleOpenAdd}
        isPublicMode={isPublicMode}
        setIsPublicMode={setIsPublicMode}
        totalCount={achievements.length}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Educational Achievements &amp; Certificates</span>
                <Sparkles className="w-6 h-6 text-amber-500 hidden sm:inline" />
              </h1>
              <p className="text-sm text-slate-500 mt-1 max-w-2xl font-medium">
                Upload, organize, and showcase your academic degrees, diplomas, exam results, and professional credentials with verifiable document attachments.
              </p>
            </div>

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all cursor-pointer self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Certificate</span>
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <StatsOverview stats={stats} achievements={achievements} />

        {/* Filter and Search Controls */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by degree title, university, grade, skills, or credential ID..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 font-medium"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto px-3 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all cursor-pointer"
              >
                <option value="date-desc">Newest Issued First</option>
                <option value="date-asc">Oldest Issued First</option>
                <option value="title-asc">Title (A - Z)</option>
                <option value="featured">Featured First</option>
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
            <button
              onClick={() => setSelectedCategory('All')}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                selectedCategory === 'All'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Records ({stats?.totalAchievements || 0})
            </button>

            {categories.map((cat) => {
              const count = stats?.categoryCounts?.[cat] || 0;
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat} {count > 0 && <span className="ml-1 opacity-75">({count})</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Achievement Grid or Empty State */}
        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">Loading your achievement vault...</p>
          </div>
        ) : achievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((item) => (
              <AchievementCard
                key={item.id}
                achievement={item}
                onEdit={handleOpenEdit}
                onDelete={(item) => setDeletingItem(item)}
                onViewDoc={handleViewDoc}
                isPublicMode={false}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto my-8">
            <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No achievements found</h3>
            <p className="text-xs text-slate-500 mb-6">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search query or category filter.'
                : 'Your vault is ready. Upload your degree certificate, semester marksheet, or course badge to get started.'}
            </p>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Upload Certificate</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-800">EduVault</span>
            <span>• Full-Stack Educational Achievement &amp; Certificate Portfolio</span>
          </div>
          <div>
            <span>Verified Credentials System • Secure File Storage</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AchievementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAchievement}
        editingItem={editingItem}
      />

      <DocumentViewerModal
        isOpen={!!viewingDoc}
        onClose={() => setViewingDoc(null)}
        doc={viewingDoc?.file}
        title={viewingDoc?.title}
      />

      <DeleteConfirmModal
        isOpen={!!deletingItem}
        item={deletingItem}
        onClose={() => setDeletingItem(null)}
        onConfirm={handleDeleteAchievement}
        isDeleting={isDeleting}
      />
    </div>
  );
}

