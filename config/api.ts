// API configuration for the frontend application
// This file contains the base URL and other configuration for API calls

// Base API URL - Update this to match your backend server
const API_BASE_URL = 'http://localhost:5000/api';

// API endpoints
const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        GOOGLE_LOGIN: '/auth/google',
        VERIFY_TOKEN: '/auth/verify',
        PROFILE: '/auth/profile',
        CHANGE_PASSWORD: '/auth/change-password',
        REQUEST_RESET: '/auth/request-reset',
        RESET_PASSWORD: '/auth/reset-password',
        ROLES: '/auth/roles',
        POSITIONS: '/auth/positions'
    },
    DASHBOARD: {
        STATS: '/dashboard/stats',
        COMPLIANCE: '/dashboard/compliance',
        RENEWALS: '/dashboard/renewals',
        BALLOTS: '/dashboard/ballots',
        TRAININGS: '/dashboard/trainings'
    },
    ORGANIZATIONS: {
        LIST: '/organizations',
        CREATE: '/organizations',
        DETAIL: '/organizations/{id}',
        UPDATE: '/organizations/{id}',
        DELETE: '/organizations/{id}',
        TYPES: '/organizations/types',
        OFFICIALS: '/organizations/{id}/officials',
        CONSTITUTIONS: '/organizations/{id}/constitutions'
    },
    AGREEMENTS: {
        LIST: '/agreements',
        CREATE: '/agreements',
        DETAIL: '/agreements/{id}',
        UPDATE: '/agreements/{id}',
        DELETE: '/agreements/{id}',
        TYPES: '/agreements/types',
        AMENDMENTS: '/agreements/{id}/amendments'
    },
    BALLOTS: {
        LIST: '/ballots',
        CREATE: '/ballots',
        DETAIL: '/ballots/{id}',
        UPDATE: '/ballots/{id}',
        DELETE: '/ballots/{id}',
        POSITIONS: '/ballots/{id}/positions',
        CANDIDATES: '/ballots/{id}/candidates',
        RESULTS: '/ballots/{id}/results'
    },
    TRAININGS: {
        LIST: '/trainings',
        CREATE: '/trainings',
        DETAIL: '/trainings/{id}',
        UPDATE: '/trainings/{id}',
        DELETE: '/trainings/{id}',
        TYPES: '/trainings/types',
        PARTICIPANTS: '/trainings/{id}/participants'
    },
    COMPLIANCE: {
        LIST: '/compliance',
        CREATE: '/compliance',
        DETAIL: '/compliance/{id}',
        UPDATE: '/compliance/{id}',
        DELETE: '/compliance/{id}',
        REQUIREMENTS: '/compliance/requirements',
        INSPECTIONS: '/compliance/inspections'
    },
    DOCUMENTS: {
        LIST: '/documents',
        UPLOAD: '/documents/upload',
        DETAIL: '/documents/{id}',
        DOWNLOAD: '/documents/{id}/download',
        DELETE: '/documents/{id}',
        TYPES: '/documents/types'
    },
    USERS: {
        LIST: '/users',
        CREATE: '/users',
        DETAIL: '/users/{id}',
        UPDATE: '/users/{id}',
        DELETE: '/users/{id}'
    },
    SETTINGS: {
        REGIONS: '/settings/regions',
        DISTRICTS: '/settings/districts',
        ROLES: '/settings/roles',
        POSITIONS: '/settings/positions',
        PERMISSIONS: '/settings/permissions'
    }
} as const;

// Request timeout in milliseconds
const REQUEST_TIMEOUT = 30000;

// File upload settings
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/gif'
] as const;

export { API_BASE_URL, API_ENDPOINTS, REQUEST_TIMEOUT, MAX_FILE_SIZE, ALLOWED_FILE_TYPES };