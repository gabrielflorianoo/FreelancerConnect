import axios from "axios";
import {
    User,
    Job,
    Message,
    Review,
    Payment,
    ClientProfile,
    FreelancerProfile,
    RegisterData,
} from "../types";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true,
});

// ========================
// ===== Auth Routes ======
// ========================
export const authAPI = {
    register: (userData: {
        name: string;
        email: string;
        password: string;
        role: "CLIENT" | "FREELANCER";
        location?: string;
        phone?: string;
    }) => api.post("/users/register", userData),
    login: (credentials: { email: string; password: string }) =>
        api.post("/users/login", credentials),
    logout: () => api.post("/users/auth/logout"),
    me: () => api.get("/users/auth/me"),
    refresh: () => api.post("/auth/refresh"),
};

// ========================
// ===== User Routes ======
// ========================
export const userAPI = {
    // Admin routes
    getAllUsers: () => api.get("/users"),

    // Public routes
    getFreelancers: (filters: {
        category?: string;
        location?: string;
        rating?: string;
    }) => api.get("/users/freelancers", { params: filters }),
    getUserById: (id: string) => api.get(`/users/profile/${id}`),
    createUser: (userData: RegisterData) =>
        api.post("/users/register", userData),

    // Protected routes
    updateProfile: (
        id: string,
        userData: {
            name?: string;
            email?: string;
            phone?: string;
            bio?: string;
            avatarUrl?: string;
            location?: string;
            services?: string[];
        }
    ) => api.put(`/users/profile/${id}`, userData),
    deleteAccount: (id: string) => api.delete(`/users/profile/${id}`),
    updatePassword: (passwordData: {
        currentPassword: string;
        newPassword: string;
    }) => api.put("/users/password", passwordData),
};

// ========================
// ===== Jobs Routes ======
// ========================
export const jobsAPI = {
    // Public routes
    getAllJobs: (filters: {
        category?: string;
        location?: string;
        status?: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
        price?: string;
    }) => api.get("/jobs", { params: filters }),
    getJobsByUser: (userId: string, status?: string) =>
        api.get(`/jobs/user/${userId}`, { params: { status } }),
    getJobById: (id: string) => api.get(`/jobs/${id}`),

    // Protected routes    getJobById: (id: string) => api.get(`/jobs/${id}`),
    createJob: (jobData: Partial<Job>) => api.post("/jobs", jobData),
    updateJob: (
        id: string,
        jobData: {
            title?: string;
            description?: string;
            category?: string;
            price?: number;
            location?: string;
            status?: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
        }
    ) => api.put(`/jobs/${id}`, jobData),
    deleteJob: (id: string) => api.delete(`/jobs/${id}`),

    // Job status routes
    acceptJob: (id: string) => api.put(`/jobs/${id}/accept`),
    completeJob: (id: string) => api.put(`/jobs/${id}/complete`),
    cancelJob: (id: string) => api.put(`/jobs/${id}/cancel`),

    // Client routes
    getMyCreatedJobs: (
        status?: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED"
    ) => api.get("/jobs/my/created", { params: { status } }),

    // Freelancer routes
    getMyAcceptedJobs: (
        status?: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED"
    ) => api.get("/jobs/my/accepted", { params: { status } }),
};

// ========================
// ==== Message Routes ====
// ========================
export const messageAPI = {
    getJobMessages: (jobId: string) => api.get(`/messages/job/${jobId}`),
    sendMessage: (jobId: string, messageData: { content: string }) =>
        api.post(`/messages/job/${jobId}`, messageData),
    deleteMessage: (id: string) => api.delete(`/messages/${id}`),
};

// ========================
// ==== Review Routes =====
// ========================
export const reviewAPI = {
    // Public routes
    getFreelancerReviews: (freelancerId: string) =>
        api.get(`/reviews/freelancer/${freelancerId}`),

    // Protected routes
    getReviewById: (id: string) => api.get(`/reviews/${id}`),
    createReview: (
        jobId: string,
        reviewData: { rating: number; comment?: string }
    ) => api.post(`/reviews/job/${jobId}`, reviewData),
    updateReview: (
        id: string,
        reviewData: { rating?: number; comment?: string }
    ) => api.put(`/reviews/${id}`, reviewData),
    deleteReview: (id: string) => api.delete(`/reviews/${id}`),
};

// ========================
// === Payment Routes =====
// ========================
export const paymentAPI = {
    // Admin routes
    getAllPayments: () => api.get("/payments"),

    // Protected routes
    getUserPayments: () => api.get("/payments/user"),
    getPaymentById: (id: string) => api.get(`/payments/${id}`),
    processPayment: (
        jobId: string,
        paymentData: { amount: number; method: string }
    ) => api.post(`/payments/job/${jobId}`, paymentData),
    withdrawBalance: (withdrawData: { amount: number; bankAccount: string }) =>
        api.post("/payments/withdraw", withdrawData),
};

// ========================
// ==== Utility Routes ====
// ========================
export const utilityAPI = {
    getCategories: () => api.get("/categories"),
    getLocations: () => api.get("/locations"),
    getApiStatus: () => api.get("/status"),
};

// ========================
// ===== Admin Routes =====
// ========================
export const adminAPI = {
    banUser: (id: string) => api.patch(`/admin/users/${id}/ban`),
    removeJob: (id: string) => api.delete(`/admin/jobs/${id}`),
    getStats: () => api.get("/admin/stats"),
};

export default api;
