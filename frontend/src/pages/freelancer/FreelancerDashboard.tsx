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
    Search,
    Briefcase,
    MessageSquare,
    Star,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle,
    Eye,
    User,
} from "lucide-react";

const FreelancerDashboard = () => {
    const [stats] = useState({
        activeJobs: 2,
        completedJobs: 28,
        totalEarned: 32150,
        avgRating: 4.9,
        profileViews: 156,
        availableJobs: 24,
    });

    const activeJobs = [
        {
            id: 1,
            title: "Desenvolvimento de App Mobile",
            client: "Tech Solutions Ltda",
            budget: 5000,
            deadline: "2024-01-15",
            progress: 65,
            status: "in_progress",
        },
        {
            id: 2,
            title: "Design de Interface",
            client: "Startup Inovadora",
            budget: 2500,
            deadline: "2024-01-10",
            progress: 30,
            status: "in_progress",
        },
    ];

    const availableJobs = [
        {
            id: 1,
            title: "Criação de Website Institucional",
            client: "Empresa ABC",
            budget: 3500,
            deadline: "30 dias",
            skills: ["React", "TypeScript", "TailwindCSS"],
            proposals: 8,
            posted: "2 dias atrás",
        },
        {
            id: 2,
            title: "App de Delivery",
            client: "Restaurante XYZ",
            budget: 8000,
            deadline: "45 dias",
            skills: ["React Native", "Node.js", "MongoDB"],
            proposals: 12,
            posted: "1 dia atrás",
        },
        {
            id: 3,
            title: "Sistema de Gestão",
            client: "Loja Online",
            budget: 6500,
            deadline: "60 dias",
            skills: ["React", "PostgreSQL", "API REST"],
            proposals: 5,
            posted: "3 horas atrás",
        },
    ];

    const recentMessages = [
        {
            id: 1,
            client: "João Silva",
            lastMessage: "Ótimo trabalho! Podemos discutir as próximas etapas?",
            time: "15 min",
            unread: true,
        },
        {
            id: 2,
            client: "Maria Santos",
            lastMessage: "Quando você pode começar o projeto?",
            time: "1h",
            unread: true,
        },
        {
            id: 3,
            client: "Pedro Costa",
            lastMessage: "Obrigado pela proposta detalhada!",
            time: "3h",
            unread: false,
        },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Dashboard do Freelancer
                    </h1>
                    <p className="text-gray-600">
                        Gerencie seus trabalhos e encontre novas oportunidades
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" asChild>
                        <Link to="/freelancer/profile">
                            <User className="mr-2 h-4 w-4" />
                            Editar Perfil
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link to="/freelancer/jobs">
                            <Search className="mr-2 h-4 w-4" />
                            Buscar Jobs
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
                            Em andamento
                        </p>
                    </CardContent>
                </Card>

                <Card className="animate-fade-in">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Concluídos
                        </CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.completedJobs}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +3 este mês
                        </p>
                    </CardContent>
                </Card>

                <Card className="animate-fade-in">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Ganho
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            R$ {stats.totalEarned.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            +18% este mês
                        </p>
                    </CardContent>
                </Card>

                <Card className="animate-fade-in">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Avaliação
                        </CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.avgRating}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            De {stats.completedJobs} avaliações
                        </p>
                    </CardContent>
                </Card>

                <Card className="animate-fade-in">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Visualizações
                        </CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.profileViews}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Esta semana
                        </p>
                    </CardContent>
                </Card>

                <Card className="animate-fade-in">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Jobs Disponíveis
                        </CardTitle>
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.availableJobs}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Na sua categoria
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Active Jobs */}
                <Card className="animate-fade-in">
                    <CardHeader>
                        <CardTitle>Trabalhos Ativos</CardTitle>
                        <CardDescription>
                            Acompanhe o progresso dos seus projetos
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activeJobs.map((job) => (
                            <div
                                key={job.id}
                                className="border rounded-lg p-4 space-y-3"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-gray-900">
                                            {job.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {job.client}
                                        </p>
                                    </div>
                                    <Badge variant="outline">
                                        R$ {job.budget.toLocaleString()}
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Prazo:{" "}
                                        {new Date(
                                            job.deadline,
                                        ).toLocaleDateString("pt-BR")}
                                    </span>
                                    <span>{job.progress}% concluído</span>
                                </div>

                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${job.progress}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/freelancer/my-jobs">
                                Ver Todos os Trabalhos
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Available Jobs */}
                <Card className="animate-fade-in">
                    <CardHeader>
                        <CardTitle>Jobs Recomendados</CardTitle>
                        <CardDescription>
                            Oportunidades que combinam com seu perfil
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {availableJobs.slice(0, 2).map((job) => (
                            <div
                                key={job.id}
                                className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-gray-900">
                                            {job.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {job.client}
                                        </p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-800">
                                        R$ {job.budget.toLocaleString()}
                                    </Badge>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                    {job.skills.map((skill) => (
                                        <Badge
                                            key={skill}
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span className="flex items-center">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {job.deadline}
                                    </span>
                                    <span>{job.proposals} propostas</span>
                                </div>

                                <Button size="sm" className="w-full">
                                    Ver Detalhes
                                </Button>
                            </div>
                        ))}
                        <Button variant="outline" className="w-full" asChild>
                            <Link to="/freelancer/jobs">
                                Ver Mais Oportunidades
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Messages */}
                <Card className="animate-fade-in">
                    <CardHeader>
                        <CardTitle>Mensagens Recentes</CardTitle>
                        <CardDescription>
                            Últimas conversas com clientes
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
                                        {message.client
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-gray-900">
                                            {message.client}
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
                            <Link to="/freelancer/messages">
                                Ver Todas as Mensagens
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="animate-fade-in">
                    <CardHeader>
                        <CardTitle>Ações Rápidas</CardTitle>
                        <CardDescription>
                            Acesse rapidamente as funcionalidades principais
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 grid-cols-2">
                            <Button
                                asChild
                                variant="outline"
                                className="h-20 flex flex-col space-y-2"
                            >
                                <Link to="/freelancer/jobs">
                                    <Search className="h-6 w-6" />
                                    <span>Buscar Jobs</span>
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="h-20 flex flex-col space-y-2"
                            >
                                <Link to="/freelancer/profile">
                                    <User className="h-6 w-6" />
                                    <span>Editar Perfil</span>
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="h-20 flex flex-col space-y-2"
                            >
                                <Link to="/freelancer/messages">
                                    <MessageSquare className="h-6 w-6" />
                                    <span>Mensagens</span>
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="h-20 flex flex-col space-y-2"
                            >
                                <Link to="/freelancer/payments">
                                    <DollarSign className="h-6 w-6" />
                                    <span>Pagamentos</span>
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default FreelancerDashboard;
