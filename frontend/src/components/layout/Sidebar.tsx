import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { cn } from "../../lib/utils";
import {
    Home,
    Briefcase,
    Users,
    MessageSquare,
    Star,
    Settings,
    CreditCard,
    FileText,
    Plus,
    Search,
} from "lucide-react";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { user } = useAuthStore();
    const location = useLocation();

    const clientNavItems = [
        { icon: Home, label: "Dashboard", href: "/client/dashboard" },
        { icon: Plus, label: "Criar Job", href: "/client/create-job" },
        { icon: Briefcase, label: "Meus Jobs", href: "/client/jobs" },
        { icon: Users, label: "Freelancers", href: "/client/freelancers" },
        { icon: MessageSquare, label: "Mensagens", href: "/client/messages" },
        { icon: Star, label: "Avaliações", href: "/client/reviews" },
        { icon: CreditCard, label: "Pagamentos", href: "/client/payments" },
    ];

    const freelancerNavItems = [
        { icon: Home, label: "Dashboard", href: "/freelancer/dashboard" },
        { icon: Search, label: "Buscar Jobs", href: "/freelancer/jobs" },
        {
            icon: Briefcase,
            label: "Meus Trabalhos",
            href: "/freelancer/my-jobs",
        },
        {
            icon: MessageSquare,
            label: "Mensagens",
            href: "/freelancer/messages",
        },
        { icon: Star, label: "Avaliações", href: "/freelancer/reviews" },
        { icon: CreditCard, label: "Pagamentos", href: "/freelancer/payments" },
        { icon: FileText, label: "Perfil", href: "/freelancer/profile" },
    ];

    const navItems =
        user?.role === "CLIENT" ? clientNavItems : freelancerNavItems;

    return (
        <>
            {/* Overlay para mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Header da sidebar */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
                        <span className="text-lg font-semibold">Menu</span>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-md hover:bg-gray-100"
                        >
                            ×
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.href;

                            return (
                                <Link
                                    key={item.href}
                                    to={item.href}
                                    onClick={onClose}
                                    className={cn(
                                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                        isActive
                                            ? "bg-primary-50 text-primary-600 border-r-2 border-primary-600"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <Icon className="mr-3 h-5 w-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Settings */}
                    <div className="p-4 border-t border-gray-200">
                        <Link
                            to="/settings"
                            onClick={onClose}
                            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors"
                        >
                            <Settings className="mr-3 h-5 w-5" />
                            Configurações
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
