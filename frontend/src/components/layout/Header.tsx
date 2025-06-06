import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Bell, MessageSquare, Search, Menu } from "lucide-react";

interface HeaderProps {
    onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo e navegação */}
                    <div className="flex items-center">
                        {onMenuClick && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onMenuClick}
                                className="mr-2 lg:hidden"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        )}

                        <Link to="/" className="flex items-center">
                            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-2 rounded-lg mr-3">
                                <span className="font-bold text-lg">FC</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                                FreelancerConnect
                            </span>
                        </Link>
                    </div>

                    {/* Barra de busca - Desktop */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Buscar serviços ou freelancers..."
                                type="search"
                            />
                        </div>
                    </div>

                    {/* Menu do usuário */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                {/* Notificações */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="relative"
                                >
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                                        3
                                    </span>
                                </Button>

                                {/* Mensagens */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="relative"
                                >
                                    <MessageSquare className="h-5 w-5" />
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                                        2
                                    </span>
                                </Button>

                                {/* Menu do perfil */}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="relative h-8 w-8 rounded-full"
                                        >
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage
                                                    src={user?.avatar}
                                                    alt={user?.name}
                                                />
                                                <AvatarFallback>
                                                    {user?.name
                                                        ?.slice(0, 2)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-56 bg-white"
                                        align="end"
                                        forceMount
                                    >
                                        <div className="flex flex-col space-y-1 p-2">
                                            <p className="text-sm font-medium leading-none">
                                                {user?.name}
                                            </p>
                                            <p className="text-xs leading-none text-gray-500">
                                                {user?.email}
                                            </p>
                                        </div>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link to="/profile">Perfil</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link to="/settings">
                                                Configurações
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                        >
                                            Sair
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Button variant="ghost" asChild>
                                    <Link to="/login">Entrar</Link>
                                </Button>
                                <Button asChild>
                                    <Link to="/register">Cadastrar</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
