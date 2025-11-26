// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const ML_SERVICE_URL = import.meta.env.VITE_ML_SERVICE_URL || 'http://127.0.0.1:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Student endpoints
  student: {
    register: `${API_BASE_URL}/student/register`,
    login: `${API_BASE_URL}/student/login`,
    getStudent: `${API_BASE_URL}/student/get-student`,
    addPortfolio: `${API_BASE_URL}/student/add-portfolio`,
    savePortfolioDetails: `${API_BASE_URL}/student/save-portfolio-details`,
  },

  // Activity endpoints
  activities: {
    add: `${API_BASE_URL}/activities/add`,
    getAll: `${API_BASE_URL}/activities/getAll`,
    remove: `${API_BASE_URL}/activities/remove`,
  },

  // Faculty endpoints
  faculty: {
    register: `${API_BASE_URL}/faculty/register`,
    login: `${API_BASE_URL}/faculty/login`,
    getAllStudents: `${API_BASE_URL}/faculty/getAllStudents`,
  },

  // Admin endpoints
  admin: {
    login: `${API_BASE_URL}/admin/login`,
    getAllStudents: `${API_BASE_URL}/admin/getAllStudents`,
    getAllFaculty: `${API_BASE_URL}/admin/getAllFaculty`,
  },

  // ML Service endpoints
  ml: {
    generatePortfolio: `${ML_SERVICE_URL}/generate_portfolio`,
  },
};
