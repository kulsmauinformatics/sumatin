// API configuration and utilities for SUMATIN frontend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    REQUEST_PASSWORD_RESET: '/auth/request-password-reset',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    HEALTH: '/auth/health'
  },
  
  // Users
  USERS: {
    BASE: '/users',
    SEARCH: '/users/search',
    STATS: '/users/stats',
    BY_ID: (id) => `/users/${id}`,
    TOGGLE_STATUS: (id) => `/users/${id}/status`,
    RESET_PASSWORD: (id) => `/users/${id}/reset-password`,
    HEALTH: '/users/health'
  },
  
  // Schools (to be added)
  SCHOOLS: {
    BASE: '/schools',
    BY_ID: (id) => `/schools/${id}`,
    STATS: (id) => `/schools/${id}/stats`
  },
  
  // Grades (to be added)
  GRADES: {
    BASE: '/grades',
    BY_ID: (id) => `/grades/${id}`,
    BY_SCHOOL: (schoolId) => `/schools/${schoolId}/grades`
  },
  
  // Students (to be added)
  STUDENTS: {
    BASE: '/students',
    BY_ID: (id) => `/students/${id}`,
    BY_GRADE: (gradeId) => `/grades/${gradeId}/students`
  },
  
  // Teachers (to be added)
  TEACHERS: {
    BASE: '/teachers',
    BY_ID: (id) => `/teachers/${id}`,
    BY_SCHOOL: (schoolId) => `/schools/${schoolId}/teachers`
  },
  
  // Attendance (to be added)
  ATTENDANCE: {
    BASE: '/attendance',
    BY_STUDENT: (studentId) => `/students/${studentId}/attendance`,
    BY_GRADE: (gradeId) => `/grades/${gradeId}/attendance`,
    TAKE: '/attendance/take',
    STATS: '/attendance/stats'
  },
  
  // Assessments (to be added)
  ASSESSMENTS: {
    BASE: '/assessments',
    BY_STUDENT: (studentId) => `/students/${studentId}/assessments`,
    BY_GRADE: (gradeId) => `/grades/${gradeId}/assessments`,
    STATS: '/assessments/stats'
  },
  
  // Library (to be added)
  LIBRARY: {
    BASE: '/library',
    RESOURCES: '/library/resources',
    BY_ID: (id) => `/library/resources/${id}`,
    SEARCH: '/library/search',
    CATEGORIES: '/library/categories'
  },
  
  // Learning (to be added)
  LEARNING: {
    BASE: '/learning',
    CONTENT: '/learning/content',
    BY_ID: (id) => `/learning/content/${id}`,
    BY_GRADE: (gradeId) => `/grades/${gradeId}/learning`
  },
  
  // Feeds (to be added)
  FEEDS: {
    BASE: '/feeds',
    BY_ID: (id) => `/feeds/${id}`,
    BY_SCHOOL: (schoolId) => `/schools/${schoolId}/feeds`
  }
};

// Token management
class TokenManager {
  static getAccessToken() {
    return localStorage.getItem('accessToken');
  }
  
  static setAccessToken(token) {
    localStorage.setItem('accessToken', token);
  }
  
  static getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }
  
  static setRefreshToken(token) {
    localStorage.setItem('refreshToken', token);
  }
  
  static clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
  
  static setTokens(accessToken, refreshToken) {
    this.setAccessToken(accessToken);
    this.setRefreshToken(refreshToken);
  }
}

// API client class
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.isRefreshing = false;
    this.failedQueue = [];
  }
  
  // Process failed queue after token refresh
  processQueue(error, token = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }
  
  // Refresh access token
  async refreshAccessToken() {
    const refreshToken = TokenManager.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    try {
      const response = await fetch(`${this.baseURL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      
      if (!response.ok) {
        throw new Error('Token refresh failed');
      }
      
      const data = await response.json();
      
      if (data.success && data.data.tokens) {
        TokenManager.setTokens(
          data.data.tokens.accessToken,
          data.data.tokens.refreshToken
        );
        return data.data.tokens.accessToken;
      } else {
        throw new Error('Invalid token refresh response');
      }
    } catch (error) {
      TokenManager.clearTokens();
      // Redirect to login page
      window.location.href = '/login';
      throw error;
    }
  }
  
  // Make HTTP request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const accessToken = TokenManager.getAccessToken();
    
    // Default headers
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    // Add authorization header if token exists
    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Make request
    let response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Handle 401 Unauthorized - try to refresh token
    if (response.status === 401 && accessToken) {
      if (this.isRefreshing) {
        // If already refreshing, wait for it to complete
        return new Promise((resolve, reject) => {
          this.failedQueue.push({ resolve, reject });
        }).then(() => {
          // Retry original request with new token
          const newToken = TokenManager.getAccessToken();
          return fetch(url, {
            ...options,
            headers: {
              ...headers,
              Authorization: `Bearer ${newToken}`,
            },
          });
        });
      }
      
      this.isRefreshing = true;
      
      try {
        const newToken = await this.refreshAccessToken();
        this.processQueue(null, newToken);
        
        // Retry original request with new token
        response = await fetch(url, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      } catch (error) {
        this.processQueue(error, null);
        throw error;
      } finally {
        this.isRefreshing = false;
      }
    }
    
    return response;
  }
  
  // GET request
  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseURL}${endpoint}`);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    
    const response = await this.request(url.pathname + url.search);
    return this.handleResponse(response);
  }
  
  // POST request
  async post(endpoint, data = {}) {
    const response = await this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }
  
  // PUT request
  async put(endpoint, data = {}) {
    const response = await this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }
  
  // PATCH request
  async patch(endpoint, data = {}) {
    const response = await this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }
  
  // DELETE request
  async delete(endpoint) {
    const response = await this.request(endpoint, {
      method: 'DELETE',
    });
    return this.handleResponse(response);
  }
  
  // Upload file
  async upload(endpoint, formData) {
    const response = await this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {}, // Don't set Content-Type for FormData
    });
    return this.handleResponse(response);
  }
  
  // Handle response
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        throw new ApiError(data.message || 'Request failed', response.status, data);
      }
      
      return data;
    } else {
      if (!response.ok) {
        throw new ApiError('Request failed', response.status);
      }
      
      return response;
    }
  }
}

// Custom API Error class
export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Create API client instance
export const apiClient = new ApiClient();

// Export token manager
export { TokenManager };

// Convenience methods for common operations
export const api = {
  // Authentication
  auth: {
    login: (credentials) => apiClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
    register: (userData) => apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData),
    logout: () => apiClient.post(API_ENDPOINTS.AUTH.LOGOUT),
    getProfile: () => apiClient.get(API_ENDPOINTS.AUTH.PROFILE),
    updateProfile: (data) => apiClient.put(API_ENDPOINTS.AUTH.PROFILE, data),
    changePassword: (data) => apiClient.put(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, data),
    requestPasswordReset: (email) => apiClient.post(API_ENDPOINTS.AUTH.REQUEST_PASSWORD_RESET, { email }),
    resetPassword: (data) => apiClient.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, data),
  },
  
  // Users
  users: {
    getAll: (params) => apiClient.get(API_ENDPOINTS.USERS.BASE, params),
    getById: (id) => apiClient.get(API_ENDPOINTS.USERS.BY_ID(id)),
    create: (userData) => apiClient.post(API_ENDPOINTS.USERS.BASE, userData),
    update: (id, userData) => apiClient.put(API_ENDPOINTS.USERS.BY_ID(id), userData),
    delete: (id) => apiClient.delete(API_ENDPOINTS.USERS.BY_ID(id)),
    toggleStatus: (id, isActive) => apiClient.patch(API_ENDPOINTS.USERS.TOGGLE_STATUS(id), { isActive }),
    resetPassword: (id, newPassword) => apiClient.patch(API_ENDPOINTS.USERS.RESET_PASSWORD(id), { newPassword }),
    search: (params) => apiClient.get(API_ENDPOINTS.USERS.SEARCH, params),
    getStats: (params) => apiClient.get(API_ENDPOINTS.USERS.STATS, params),
  },
  
  // File upload helper
  upload: (endpoint, file, additionalData = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });
    
    return apiClient.upload(endpoint, formData);
  },
};

// Helper functions
export const isAuthenticated = () => {
  return !!TokenManager.getAccessToken();
};

export const logout = () => {
  TokenManager.clearTokens();
  window.location.href = '/login';
};

export default api;

