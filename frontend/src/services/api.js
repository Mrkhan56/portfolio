// Load API Base URL from .env file (default to '/api')
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

// Helper to get full file URL (handles cross-domain when Frontend is on Amplify & Backend on EC2)
export function getFileUrl(url) {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (API_BASE.startsWith('http://') || API_BASE.startsWith('https://')) {
    try {
      const origin = new URL(API_BASE).origin;
      return `${origin}${url.startsWith('/') ? '' : '/'}${url}`;
    } catch (e) {
      return url;
    }
  }
  return url;
}

export const api = {
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    return data.data || [];
  },

  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    const data = await res.json();
    return data.data;
  },

  async getAchievements(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') {
      query.append('category', params.category);
    }
    if (params.search) {
      query.append('search', params.search);
    }
    if (params.sortBy) {
      query.append('sortBy', params.sortBy);
    }

    const res = await fetch(`${API_BASE}/achievements?${query.toString()}`);
    const data = await res.json();
    return data.data || [];
  },

  async getAchievementById(id) {
    const res = await fetch(`${API_BASE}/achievements/${id}`);
    const data = await res.json();
    return data.data;
  },

  async createAchievement(formData) {
    const res = await fetch(`${API_BASE}/achievements`, {
      method: 'POST',
      body: formData, // FormData contains file & text fields
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to create achievement');
    }
    return data.data;
  },

  async updateAchievement(id, formData) {
    const res = await fetch(`${API_BASE}/achievements/${id}`, {
      method: 'PUT',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update achievement');
    }
    return data.data;
  },

  async deleteAchievement(id) {
    const res = await fetch(`${API_BASE}/achievements/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete achievement');
    }
    return true;
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/profile`);
    const data = await res.json();
    return data.data;
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to update profile');
    }
    return data.data;
  }
};

