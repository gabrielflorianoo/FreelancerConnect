import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../../components/ui/avatar";
import {
    Plus,
    Briefcase,
    Users,
    MessageSquare,
    Star,
    Clock,
    DollarSign,
    TrendingUp,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

const ClientDashboard = () => {
    const [stats] = useState({
        activeJobs: 3,
        completedJobs: 12,
        totalSpent: 15420,
        avgRating: 4.8,
    });

    const recentJobs = [
        {
            id: 1,
            title: "Desenvolvimento de App Mobile",
            status: "in_progress",
            budget: 5000,
            deadline: "2024-01-15",
            freelancer: {
                name: "Ana Silva",
                avatar: "",
                rating: 4.9,
            },
            proposals: 12,
        },
        {
            id: 2,
            title: "Design de Logo e Identidade Visual",
            status: "completed",
            budget: 800,
            deadline: "2023-12-20",
            freelancer: {
                name: "Carlos Santos",
                avatar: "",
                rating: 4.8,
            },
            proposals: 8,
        },
        {
            id: 3,
            title: "Gestão de Redes Sociais",
            status: "open",
            budget: 1200,
            deadline: "2024-01-30",
            freelancer: null,
            proposals: 15,
        },
    ];

    const recentMessages = [
        {
            id: 1,
            freelancer: "Ana Silva",
            lastMessage:
                "Olá! Acabei de enviar a primeira versão do protótipo...",
            time: "10 min",
            unread: true,
        },
        {
            id: 2,
            freelancer: "João Santos",
            lastMessage:
                "Quando podemos agendar uma reunião para discutir o projeto?",
            time: "2h",
            unread: false,
        },
        {
            id: 3,
            freelancer: "Marina Costa",
            lastMessage:
                "Obrigada pelo feedback! Vou implementar as alterações...",
            time: "1 dia",
            unread: false,
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "open":
                return "bg-blue-100 text-blue-800";
            case "in_progress":
                return "bg-yellow-100 text-yellow-800";
            case "completed":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "open":
                return "Aberto";
            case "in_progress":
                return "Em Andamento";
            case "completed":
                return "Concluído";
            default:
                return status;
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Dashboard do Cliente
                    </h1>
                    <p className="text-gray-600">
                        Gerencie seus projetos e acompanhe o progresso
                    </p>
                </div>
                <Button asChild>
                    <Link to="/client/create-job">
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Novo Job
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="animate-fade-in">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Jobs Ativos
                        </CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.activeJobs}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +2 desde o mês passado
                        </p>
                    </CardContent>
                </Card>

                <Card className="animate-fade-in">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Jobs Concluídos
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.completedJobs}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +4 desde o mês passado
                        </p>
                    </CardContent>
                </Card>

                <Card className="animate-fade-in">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Investido
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            R$ {stats.totalSpent.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +12% desde o mês passado
                        </p>
                    </CardContent>
                </Card>

                <Card className="animate-fade-in">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Avaliação Média
                        </CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.avgRating}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Baseado em {stats.completedJobs} avaliações
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Recent Jobs */}
                <Card className="animate-fade-in">
                    <CardHeader>
                        <CardTitle>Jobs Recentes</CardTitle>
                        <CardDescription>
                            Acompanhe o status dos seus projetos
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentJobs.map((job) => (
                            <div
                                key={job.id}
                                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-900 mb-1">
                                        {job.title}
                                    </h3>
                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                        <Badge
                                            className={getStatusColor(
                                                job.status,
                                            )}
                                        >
                                            {getStatusText(job.status)}
                                        </Badge>
                                        <span className="flex items-center">
                                            <DollarSign className="h-3 w-3 mr-1" />
                                            R$ {job.budget.toLocaleString()}
                                        </span>
                                        {job.freelancer ? (
                                            <span className="flex items-center">
                                                <Users className="h-3 w-3 mr-1" />
                                                {job.freelancer.name}
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-blue-600">
                                                <Users className="h-3 w-3 mr-1" />
                                                {job.proposals} propostas
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {job.status === "in_progress" && (
                                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                                )}
                                {job.status === "completed" && (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                                {job.status === "open" && (
                                    <Clock className="h-4 w-4 text-blue-500" />
                                )}
                            </div>
                        ))}
                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/client/jobs">Ver Todos os Jobs</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Recent Messages */}
                <Card className="animate-fade-in">
                    <CardHeader>
                        <CardTitle>Mensagens Recentes</CardTitle>
                        <CardDescription>
                            Últimas conversas com freelancers
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {recentMessages.map((message) => (
                            <div
                                key={message.id}
                                className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                        {message.freelancer
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-900">
                                            {message.freelancer}
                                        </p>
                                        <span className="text-xs text-gray-500">
                                            {message.time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 truncate">
                                        {message.lastMessage}
                                    </p>
                                </div>
                                {message.unread && (
                                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                                )}
                            </div>
                        ))}
                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/client/messages">
                                Ver Todas as Mensagens
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions */}
            <Card className="animate-fade-in">
                <CardHeader>
                    <CardTitle>Ações Rápidas</CardTitle>
                    <CardDescription>
                        Acesse rapidamente as funcionalidades mais importantes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Button
                            asChild
                            variant="outline"
                            className="h-20 flex flex-col space-y-2"
                        >
                            <Link to="/client/create-job">
                                <Plus className="h-6 w-6" />
                                <span>Criar Job</span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="h-20 flex flex-col space-y-2"
                        >
                            <Link to="/client/freelancers">
                                <Users className="h-6 w-6" />
                                <span>Buscar Freelancers</span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="h-20 flex flex-col space-y-2"
                        >
                            <Link to="/client/messages">
                                <MessageSquare className="h-6 w-6" />
                                <span>Mensagens</span>
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="h-20 flex flex-col space-y-2"
                        >
                            <Link to="/client/payments">
                                <DollarSign className="h-6 w-6" />
                                <span>Pagamentos</span>
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ClientDashboard;
