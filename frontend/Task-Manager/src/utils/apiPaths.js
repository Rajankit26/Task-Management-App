export const BASE_URL = "http://localhost:8000";

// utils/apiPaths.js
export const API_PATHS = {
    AUTH: {
        REGISTER : "/api/auth/register", //Register a new user (Admin or Member)
        LOGIN: "/api/auth/login", //Authenticate user & return JWT token
        GET_PROFILE: "/api/auth/profile", // Get logged-in user details
    },

    USERS: {
        GET_ALL_USERS: "",
        GET_USER_bY_ID: (userId) => `/api/users/${userId}`, // Get user by userId
        CREATE_USER: "/api/users", // ctreate a new user (Admin Only)
        UPDATE_USER:  (userId) => `/api/users/${userId}`, //Update user details
        DELETE_USER:  (userId) => `/api/users/${userId}`, //Delete user details
    },

    TASKS: {
        GET_DASHBOARD_DATA : "/api/tasks/dashboard-data",
        GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data",
        GET_ALL_TASKS: "/api/tasks",
        GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`,
        CREATE_TASK: "/api/tasks",
        UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`,
        DELETE_TASK: (taskId) => `/api/tasks/${taskId}`,

        UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`,
        UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`
    },

    REPORTS : {
        EXPORT_TASKS: "/api/reports/export/tasks",
        EXPORT_USERS: "/api/reports/export/users",
    },

    IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-image",
    },
};