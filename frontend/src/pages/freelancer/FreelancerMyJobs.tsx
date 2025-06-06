import { useState, useEffect } from "react";
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
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../../components/ui/avatar";
import {
    Search,
    DollarSign,
    Clock,
    MessageSquare,
    FileText,
    CheckCircle,
    AlertCircle,
    Star,
} from "lucide-react";
import { jobsAPI } from "../../server/api";
import { Job } from "../../types";
import { useToast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";

// Interface para o formato UI do job
interface UIJob extends Job {
    progress: number;
    lastActivity: string;
    clientRating?: number;
    completedAt?: string;
}

const FreelancerMyJobs = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState<UIJob[]>([]);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                // Chama a API para buscar os trabalhos aceitos pelo freelancer
                const response = await jobsAPI.getMyAcceptedJobs();

                // Verifica se a resposta contém dados
                if (!response || !response.data) {
                    throw new Error("Dados não encontrados na resposta.");
                }

                // Mapear os jobs da API para o formato esperado pela UI
                const formattedJobs = response.data.map(
                    (job: Job): UIJob => ({
                        ...job,
                        progress: calculateProgress(job),
                        lastActivity: formatLastActivity(job.updatedAt),
                        budget:
                            typeof job.budget === "string"
                                ? parseFloat(job.budget)
                                : job.budget,
                        // Não usamos mais valores mockados para avaliação
                        clientRating: undefined, // Será obtido de revisões em implementação futura
                        completedAt:
                            job.status === "COMPLETED"
                                ? job.updatedAt
                                : undefined,
                    })
                );

                setJobs(formattedJobs);
            } catch (error) {
                console.error("Erro ao buscar trabalhos:", error);
                toast({
                    title: "Erro",
                    description: "Não foi possível carregar seus trabalhos.",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [toast]);

    // Função para calcular o progresso com base nas datas
    const calculateProgress = (job: Job): number => {
        if (job.status === "COMPLETED") return 100;
        if (job.status === "PENDING") return 0;

        // Se tiver deadline, calculamos baseado no tempo decorrido
        if (job.deadline) {
            const startDate = new Date(job.createdAt).getTime();
            const endDate = new Date(job.deadline).getTime();
            const now = Date.now();

            // Progresso baseado no tempo decorrido
            const totalTime = endDate - startDate;
            const elapsedTime = now - startDate;
            const progress = Math.min(
                Math.floor((elapsedTime / totalTime) * 100),
                99
            );
            return progress;
        }

        // Valor padrão para jobs sem deadline
        return 50;
    };

    // Formatar o texto de última atividade
    const formatLastActivity = (updatedAt: string): string => {
        const lastUpdate = new Date(updatedAt);
        const now = new Date();
        const diffMs = now.getTime() - lastUpdate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 60) return `${diffMins} minutos atrás`;
        if (diffHours < 24) return `${diffHours} horas atrás`;
        return `${diffDays} dias atrás`;
    };

    // Mapeamento de status da API para status da UI
    const mapApiStatusToUiStatus = (apiStatus: string): string => {
        switch (apiStatus) {
            case "PENDING":
                return "pending_approval";
            case "ACCEPTED":
                return "in_progress";
            case "COMPLETED":
                return "completed";
            case "CANCELLED":
                return "paused";
            default:
                return "active";
        }
    };
    const getStatusColor = (status: string) => {
        // Converter o status da API para o formato UI
        const uiStatus = mapApiStatusToUiStatus(status);
        switch (uiStatus) {
            case "active":
                return "bg-blue-100 text-blue-800";
            case "in_progress":
                return "bg-yellow-100 text-yellow-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "pending_approval":
                return "bg-purple-100 text-purple-800";
            case "paused":
                return "bg-orange-100 text-orange-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusText = (status: string) => {
        // Converter o status da API para o formato UI
        const uiStatus = mapApiStatusToUiStatus(status);
        switch (uiStatus) {
            case "active":
                return "Ativo";
            case "in_progress":
                return "Em Andamento";
            case "completed":
                return "Concluído";
            case "pending_approval":
                return "Aguardando Aprovação";
            case "paused":
                return "Pausado";
            default:
                return status;
        }
    };

    const filteredJobs = jobs.filter((job) => {
        const uiStatus = mapApiStatusToUiStatus(job.status);
        const matchesSearch =
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.client?.name || "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === "all" || uiStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const jobsByStatus = {
        all: filteredJobs,
        active: filteredJobs.filter((job) => {
            const uiStatus = mapApiStatusToUiStatus(job.status);
            return uiStatus === "active" || uiStatus === "in_progress";
        }),
        completed: filteredJobs.filter(
            (job) => mapApiStatusToUiStatus(job.status) === "completed"
        ),
        pending: filteredJobs.filter(
            (job) => mapApiStatusToUiStatus(job.status) === "pending_approval"
        ),
    };

    const renderProgressBar = (progress: number) => (
        <div className="w-full bg-gray-200 rounded-full h-2">
            <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
            />
        </div>
    );

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    Meus Trabalhos
                </h1>
                <p className="text-gray-600">
                    Acompanhe o progresso de todos os seus projetos
                </p>
            </div>

            <div className="flex space-x-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Buscar projetos..."
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
                        <SelectItem value="active">Ativos</SelectItem>
                        <SelectItem value="completed">Concluídos</SelectItem>
                        <SelectItem value="pending_approval">
                            Aguardando
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="flex justify-center p-8">
                    <p>Carregando seus trabalhos...</p>
                </div>
            ) : (
                <Tabs defaultValue="all" className="w-full">
                    <TabsList>
                        <TabsTrigger value="all">
                            Todos ({jobsByStatus.all.length})
                        </TabsTrigger>
                        <TabsTrigger value="active">
                            Ativos ({jobsByStatus.active.length})
                        </TabsTrigger>
                        <TabsTrigger value="completed">
                            Concluídos ({jobsByStatus.completed.length})
                        </TabsTrigger>
                        <TabsTrigger value="pending">
                            Aguardando ({jobsByStatus.pending.length})
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
                                            Nenhum projeto encontrado para este
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
                                            <div className="space-y-4">
                                                {/* Informações do Cliente */}
                                                <div className="flex items-center space-x-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarImage
                                                            src={
                                                                job.client
                                                                    .avatar
                                                            }
                                                        />
                                                        <AvatarFallback>
                                                            {job.client.name
                                                                .split(" ")
                                                                .map(
                                                                    (n) => n[0]
                                                                )
                                                                .join("")}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-gray-900">
                                                            {job.client.name}
                                                        </p>
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                                                            {job.clientRating?.toString() ||
                                                                0}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Progresso */}
                                                {job.status !== "COMPLETED" && (
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-sm">
                                                            <span>
                                                                Progresso
                                                            </span>
                                                            <span>
                                                                {job.progress}%
                                                            </span>
                                                        </div>
                                                        {renderProgressBar(
                                                            job.progress
                                                        )}
                                                    </div>
                                                )}

                                                {/* Informações do Projeto */}
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                                    <div className="flex items-center">
                                                        <DollarSign className="h-4 w-4 mr-1" />
                                                        R${" "}
                                                        {job.budget.toLocaleString()}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Clock className="h-4 w-4 mr-1" />
                                                        {new Date(
                                                            job.deadline
                                                        ).toLocaleDateString()}
                                                    </div>
                                                    <div>
                                                        Categoria:{" "}
                                                        {job.category}
                                                    </div>
                                                    <div>
                                                        Última atividade:{" "}
                                                        {job.lastActivity}
                                                    </div>
                                                </div>

                                                {/* Avaliação do Cliente (apenas para projetos concluídos) */}
                                                {job.status === "COMPLETED" &&
                                                    job.clientRating && (
                                                        <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
                                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                                            <span className="text-sm text-green-800">
                                                                Projeto
                                                                concluído -
                                                                Avaliação:{" "}
                                                                {
                                                                    job.clientRating
                                                                }{" "}
                                                                estrelas
                                                            </span>
                                                        </div>
                                                    )}

                                                {/* Ações */}
                                                <div className="flex space-x-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => navigate(`/jobs/${job.id}`)}
                                                    >
                                                        <FileText className="h-4 w-4 mr-1" />
                                                        Ver Detalhes
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                    >
                                                        <MessageSquare className="h-4 w-4 mr-1" />
                                                        Mensagens
                                                    </Button>
                                                    {job.status ===
                                                        "PENDING" && (
                                                        <Button size="sm">
                                                            Enviar Entrega
                                                        </Button>
                                                    )}
                                                    {job.status ===
                                                        "COMPLETED" && (
                                                        <div className="flex items-center text-sm text-yellow-600">
                                                            <AlertCircle className="h-4 w-4 mr-1" />
                                                            Aguardando revisão
                                                            do cliente
                                                        </div>
                                                    )}
                                                </div>
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

export default FreelancerMyJobs;
