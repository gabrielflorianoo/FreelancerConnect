import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore, checkAuth } from "./store/authStore";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ClientDashboard from "./pages/client/ClientDashboard";
import FreelancerDashboard from "./pages/freelancer/FreelancerDashboard";
import NotFound from "./pages/NotFound";
import React, { useEffect } from "react";
import CreateJob from "./pages/client/CreateJob";
import ClientJobs from "./pages/client/ClientJobs";
import FreelancerJobs from "./pages/freelancer/FreelancerJobs";
import Messages from "./pages/shared/Messages";
import Reviews from "./pages/shared/Reviews";
import Payments from "./pages/shared/Payments";
import SettingsPage from "./pages/shared/Settings";
import FreelancerProfile from "./pages/freelancer/FreelancerProfile";
import FreelancerMyJobs from "./pages/freelancer/FreelancerMyJobs";
import ClientFreelancers from "./pages/client/ClientFreelancers";
import JobSinglePage from "./pages/job/JobSinglePage";
import ProfileDetails from "./pages/shared/ProfileDetails";

const queryClient = new QueryClient();

// Remova a função initializeAuth pois agora usamos useEffect para verificação de autenticação

// Protected Route Component
const ProtectedRoute = ({
    children,
    userType,
}: {
    children: React.ReactNode;
    userType?: "CLIENT" | "FREELANCER" | "ADMIN";
}) => {
    const { isAuthenticated, user, loading } = useAuthStore();

    // Use useEffect para verificar a autenticação apenas uma vez na montagem
    React.useEffect(() => {
        if (!isAuthenticated && !loading) {
            checkAuth();
        }
    }, [isAuthenticated, loading]);

    // Se estiver carregando, mostre um indicador de carregamento
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                Carregando...
            </div>
        );
    }

    // Se não estiver autenticado após a verificação, redirecione
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Se o tipo de usuário não corresponder, redirecione
    if (userType && user?.role != userType) {
        const redirectPath =
            user?.role === "CLIENT"
                ? "/client/dashboard"
                : "/freelancer/dashboard";
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};

const App = () => {
    const { isAuthenticated, user } = useAuthStore();

    // Verificar autenticação quando o App for montado
    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Layout />}>
                            {/* Public routes */}
                            <Route
                                index
                                element={
                                    isAuthenticated ? (
                                        <Navigate
                                            to={
                                                user?.role === "CLIENT"
                                                    ? "/client/dashboard"
                                                    : "/freelancer/dashboard"
                                            }
                                            replace
                                        />
                                    ) : (
                                        <Home />
                                    )
                                }
                            />
                            <Route
                                path="/login"
                                element={
                                    isAuthenticated ? (
                                        <Navigate
                                            to={
                                                user?.role === "CLIENT"
                                                    ? "/client/dashboard"
                                                    : "/freelancer/dashboard"
                                            }
                                            replace
                                        />
                                    ) : (
                                        <Login />
                                    )
                                }
                            />
                            <Route
                                path="/register"
                                element={
                                    isAuthenticated ? (
                                        <Navigate
                                            to={
                                                user?.role === "CLIENT"
                                                    ? "/client/dashboard"
                                                    : "/freelancer/dashboard"
                                            }
                                            replace
                                        />
                                    ) : (
                                        <Register />
                                    )
                                }
                            />

                            {/* Settings */}
                            <Route
                                path="/settings"
                                element={
                                    <ProtectedRoute>
                                        <SettingsPage />
                                    </ProtectedRoute>
                                }
                            />
                            {/*  */}
                            <Route
                                path="/jobs/:id"
                                element={
                                    <ProtectedRoute>
                                        <JobSinglePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile/:userId"
                                element={
                                    <ProtectedRoute>
                                        <ProfileDetails />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Client routes */}
                            <Route
                                path="/client/dashboard"
                                element={
                                    <ProtectedRoute userType="CLIENT">
                                        <ClientDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/client/create-job"
                                element={
                                    <ProtectedRoute userType="CLIENT">
                                        <CreateJob />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/client/jobs"
                                element={
                                    <ProtectedRoute userType="CLIENT">
                                        <ClientJobs />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/client/freelancers"
                                element={
                                    <ProtectedRoute userType="CLIENT">
                                        <ClientFreelancers />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/client/messages"
                                element={
                                    <ProtectedRoute userType="CLIENT">
                                        <Messages />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/client/reviews"
                                element={
                                    <ProtectedRoute userType="CLIENT">
                                        <Reviews />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/client/payments"
                                element={
                                    <ProtectedRoute userType="CLIENT">
                                        <Payments />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Freelancer routes */}
                            <Route
                                path="/freelancer/dashboard"
                                element={
                                    <ProtectedRoute userType="FREELANCER">
                                        <FreelancerDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/freelancer/jobs"
                                element={
                                    <ProtectedRoute userType="FREELANCER">
                                        <FreelancerJobs />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/freelancer/my-jobs"
                                element={
                                    <ProtectedRoute userType="FREELANCER">
                                        <FreelancerMyJobs />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/freelancer/messages"
                                element={
                                    <ProtectedRoute userType="FREELANCER">
                                        <Messages />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/freelancer/reviews"
                                element={
                                    <ProtectedRoute userType="FREELANCER">
                                        <Reviews />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/freelancer/payments"
                                element={
                                    <ProtectedRoute userType="FREELANCER">
                                        <Payments />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/freelancer/profile"
                                element={
                                    <ProtectedRoute userType="FREELANCER">
                                        <FreelancerProfile />
                                    </ProtectedRoute>
                                }
                            />

                            {/* Catch all route */}
                            <Route path="*" element={<NotFound />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </TooltipProvider>
        </QueryClientProvider>
    );
};

export default App;
