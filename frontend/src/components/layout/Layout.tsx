import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuthStore } from "../../store/authStore";

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { isAuthenticated } = useAuthStore();

    return (
        <div className="min-h-screen bg-gray-50">
            <Header onMenuClick={() => setSidebarOpen(true)} />

            <div className="flex">
                {isAuthenticated && (
                    <Sidebar
                        isOpen={sidebarOpen}
                        onClose={() => setSidebarOpen(false)}
                    />
                )}

                <main className="flex-1 lg:ml-0">
                    <div className="animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
