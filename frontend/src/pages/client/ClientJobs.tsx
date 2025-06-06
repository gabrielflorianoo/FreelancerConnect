import React, { useState, useEffect } from "react";
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
import { Input } from "../../components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs";
import {
    Plus,
    Search,
    Clock,
    DollarSign,
    Users,
    Eye,
    Edit,
    Trash2,
    Loader2,
} from "lucide-react";
import { Job } from "@/types";
import { jobsAPI } from "@/server/api";
import { useAuthStore } from "@/store/authStore";

const ClientJobs = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuthStore();

    const fetchJobs = async () => {
        if (!user?.id) return;

        setLoading(true);
        setError(null);

        try {
            // Converte o filtro de status da UI para o formato da API
            let apiStatus: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED" | undefined;
            if (statusFilter !== "all") {
                // Mapeia os valores da UI para os valores da API
                const statusMap = {
                    open: "PENDING" as "PENDING",
                    in_progress: "ACCEPTED" as "ACCEPTED",
                    completed: "COMPLETED" as "COMPLETED",
                    cancelled: "CANCELLED" as "CANCELLED",
                };
                apiStatus = statusMap[statusFilter as keyof typeof statusMap];
            }

            const response = await jobsAPI.getMyCreatedJobs(apiStatus);
            setJobs(response.data);
        } catch (err) {
            console.error("Erro ao buscar jobs:", err);
            setError(
                "Não foi possível carregar seus jobs. Tente novamente mais tarde."
            );
        } finally {
            setLoading(false);
        }
    };

    // Usar useEffect com uma dependência para evitar chamadas infinitas
    useEffect(() => {
        fetchJobs();
    }, [user?.id, statusFilter]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-blue-100 text-blue-800";
            case "ACCEPTED":
                return "bg-yellow-100 text-yellow-800";
            case "COMPLETED":
                return "bg-green-100 text-green-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "PENDING":
                return "Aberto";
            case "ACCEPTED":
                return "Em Andamento";
            case "COMPLETED":
                return "Concluído";
            case "CANCELLED":
                return "Cancelado";
            default:
                return status;
        }
    };

    // Converte status da API para as chaves usadas na UI
    const apiStatusToUiStatus = (status: string): string => {
        switch (status) {
            case "PENDING":
                return "open";
            case "ACCEPTED":
                return "in_progress";
            case "COMPLETED":
                return "completed";
            case "CANCELLED":
                return "cancelled";
            default:
                return "all";
        }
    };

    const filteredJobs = jobs.filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase());

        // Se o filtro é "all", mostra todos; senão, converte o status da UI para API e compara
        const matchesStatus =
            statusFilter === "all" ||
            apiStatusToUiStatus(job.status) === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const jobsByStatus = {
        all: filteredJobs,
        open: filteredJobs.filter((job) => job.status === "PENDING"),
        in_progress: filteredJobs.filter((job) => job.status === "ACCEPTED"),
        completed: filteredJobs.filter((job) => job.status === "COMPLETED"),
        cancelled: filteredJobs.filter((job) => job.status === "CANCELLED"),
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Meus Jobs
                    </h1>
                    <p className="text-gray-600">
                        Gerencie todos os seus projetos
                    </p>
                </div>
                <Button asChild>
                    <Link to="/client/create-job">
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Novo Job
                    </Link>
                </Button>
            </div>

            <div className="flex space-x-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Buscar jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="open">Abertos</SelectItem>
                        <SelectItem value="in_progress">
                            Em Andamento
                        </SelectItem>
                        <SelectItem value="completed">Concluídos</SelectItem>
                        <SelectItem value="cancelled">Cancelados</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-800 rounded-md border border-red-200">
                    {error}
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-2"
                        onClick={fetchJobs}
                    >
                        Tentar novamente
                    </Button>
                </div>
            )}

            {loading && (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Carregando jobs...</span>
                </div>
            )}

            {!loading && !error && (
                <Tabs defaultValue="all" className="w-full">
                    <TabsList>
                        <TabsTrigger value="all">
                            Todos ({jobsByStatus.all.length})
                        </TabsTrigger>
                        <TabsTrigger value="open">
                            Abertos ({jobsByStatus.open.length})
                        </TabsTrigger>
                        <TabsTrigger value="in_progress">
                            Em Andamento ({jobsByStatus.in_progress.length})
                        </TabsTrigger>
                        <TabsTrigger value="completed">
                            Concluídos ({jobsByStatus.completed.length})
                        </TabsTrigger>
                        <TabsTrigger value="cancelled">
                            Cancelados ({jobsByStatus.cancelled.length})
                        </TabsTrigger>
                    </TabsList>

                    {Object.entries(jobsByStatus).map(([status, jobs]) => (
                        <TabsContent
                            key={status}
                            value={status}
                            className="space-y-4"
                        >
                            {jobs.length === 0 ? (
                                <Card>
                                    <CardContent className="text-center py-8">
                                        <p className="text-gray-500">
                                            Nenhum job encontrado para este
                                            filtro.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                jobs.map((job) => (
                                    <Card
                                        key={job.id}
                                        className="hover:shadow-md transition-shadow"
                                    >
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <CardTitle className="text-lg">
                                                        {job.title}
                                                    </CardTitle>
                                                    <CardDescription className="mt-2">
                                                        {job.description}
                                                    </CardDescription>
                                                </div>
                                                <Badge
                                                    className={getStatusColor(
                                                        job.status
                                                    )}
                                                >
                                                    {getStatusText(job.status)}
                                                </Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <DollarSign className="h-4 w-4 mr-1" />
                                                    R${" "}
                                                    {job.budget.toLocaleString()}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    {new Date(
                                                        job.createdAt
                                                    ).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    Deadline:{" "}
                                                    {job.deadline
                                                        ? new Date(job.deadline).toLocaleDateString()
                                                        : "Não definido"}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Users className="h-4 w-4 mr-1" />
                                                    {job.freelancer
                                                        ? job.freelancer.name
                                                        : "Sem freelancer"}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Categoria: {job.category}
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <Link to={`/client/jobs/${job.id}`}>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        Ver Detalhes
                                                    </Button>
                                                </Link>
                                                {job.status === "PENDING" && (
                                                    <>
                                                        <Link to={`/client/jobs/${job.id}/edit`}>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                            >
                                                                <Edit className="h-4 w-4 mr-1" />
                                                                Editar
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => {
                                                                if (window.confirm("Tem certeza que deseja excluir este job?")) {
                                                                    jobsAPI.deleteJob(job.id)
                                                                        .then(() => {
                                                                            fetchJobs();
                                                                        })
                                                                        .catch(err => {
                                                                            console.error("Erro ao excluir job:", err);
                                                                            alert("Erro ao excluir job. Tente novamente.");
                                                                        });
                                                                }
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                            Excluir
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </TabsContent>
                    ))}
                </Tabs>
            )}
        </div>
    );
};

export default ClientJobs;
