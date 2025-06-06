/**
 * FreelancerJobs Component
 *
 * This component displays available jobs for freelancers to browse and accept.
 * Features:
 * - Real-time job fetching from backend API
 * - Filtering by category, budget and search term
 * - Job acceptance functionality
 * - Loading states and error handling
 */
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
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../../components/ui/avatar";
import {
    Search,
    MapPin,
    DollarSign,
    Clock,
    Users,
    Heart,
    Eye,
    Filter,
    Loader2,
    RefreshCw,
} from "lucide-react";
import { jobsAPI } from "@/server/api";
import { Job } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";

// Define an extended interface for the job with additional UI properties
interface EnrichedJob extends Omit<Job, "client"> {
    projectType: string;
    proposals: number;
    postedAt: string;
    client: {
        id: string;
        name: string;
        avatar?: string;
        rating?: number;
        location?: string;
        jobsPosted?: number;
    };
}

const FreelancerJobs = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [budgetFilter, setBudgetFilter] = useState("all");

    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0); // Para forçar atualização

    useEffect(() => {
        fetchJobs();
    }, [categoryFilter, refreshKey]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            setError(null);

            const filters: {
                category?: string;
                status?: "PENDING" | "ACCEPTED" | "COMPLETED" | "CANCELLED";
            } = {
                status: "PENDING", // Apenas jobs pendentes (ainda não aceitos)
            };

            if (categoryFilter !== "all") {
                filters.category = categoryFilter;
            }

            const response = await jobsAPI.getAllJobs(filters);

            // Verificar se a resposta tem a estrutura esperada
            if (response && response.data && Array.isArray(response.data)) {
                setJobs(response.data);
            } else {
                console.error("Formato de resposta inválido:", response);
                throw new Error("Formato de resposta inválido do servidor");
            }
        } catch (err) {
            console.error("Erro ao buscar jobs:", err);
            setError(
                "Não foi possível carregar os jobs. Tente novamente mais tarde."
            );
            toast({
                title: "Erro",
                description: "Falha ao buscar jobs disponíveis.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const handleAcceptJob = async (jobId: string) => {
        try {
            await jobsAPI.acceptJob(jobId);
            toast({
                title: "Sucesso!",
                description: "Você aceitou o job com sucesso!",
            });
            fetchJobs(); // Atualizar a lista de jobs após aceitar
        } catch (err) {
            console.error("Erro ao aceitar job:", err);
            toast({
                title: "Erro",
                description:
                    "Não foi possível aceitar o job. Tente novamente mais tarde.",
                variant: "destructive",
            });
        }
    };

    // Função para enriquecer os dados do job com informações complementares
    const getEnrichedJob = (job: Job): EnrichedJob => {
        // Verifica se job.skills existe antes de usar, ou fornece um array vazio como padrão
        const skills = job.skills || [];

        // Valor padrão caso o tipo não seja definido
        const projectType = job.budget ? "fixed" : "hourly";

        // Dados fictícios para simular as propostas (ainda não estão no backend)
        const proposals = Math.floor(Math.random() * 15) + 1;

        // Estabelecer um valor padrão para experience se não existir
        const experience = job.experience || "intermediario";

        // Garantir que deadline existe, caso contrário usar uma data futuro (+30 dias)
        const deadline =
            job.deadline ||
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

        // Garantir que budget é um número para manipulação adequada
        const budget =
            typeof job.budget === "string"
                ? parseFloat(job.budget)
                : job.budget || 0;

        return {
            ...job,
            budget,
            skills,
            projectType,
            proposals,
            experience,
            deadline,
            postedAt: job.createdAt || new Date().toISOString(),
            client: job.client || {
                id: job.clientId,
                name: "Cliente",
                avatar: "",
                rating: 4.5,
                location: "Localização não disponível",
                jobsPosted: 5,
            },
        };
    };

    const categories = [
        "Desenvolvimento Web",
        "Design Gráfico",
        "Marketing Digital",
        "Redação",
        "Tradução",
        "Fotografia",
        "Vídeo",
        "Consultoria",
    ];

    const filteredJobs = jobs.map(getEnrichedJob).filter((job) => {
        const matchesSearch =
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (job.skills &&
                job.skills.some((skill) =>
                    skill.toLowerCase().includes(searchTerm.toLowerCase())
                ));

        // Filtragem de categoria já é feita no backend, exceto pelo termo de busca
        const matchesCategory = true;

        const budget =
            typeof job.budget === "string"
                ? parseFloat(job.budget)
                : job.budget || 0;

        const matchesBudget =
            budgetFilter === "all" ||
            (budgetFilter === "low" && budget < 1000) ||
            (budgetFilter === "medium" && budget >= 1000 && budget < 5000) ||
            (budgetFilter === "high" && budget >= 5000);

        return matchesSearch && matchesBudget;
    });

    const getExperienceText = (level: string) => {
        switch (level) {
            case "iniciante":
                return "Iniciante";
            case "intermediario":
                return "Intermediário";
            case "avancado":
                return "Avançado";
            case "especialista":
                return "Especialista";
            default:
                return level;
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Buscar Jobs
                    </h1>
                    <p className="text-gray-600">
                        Encontre projetos que combinam com suas habilidades
                    </p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center"
                >
                    <RefreshCw
                        className={`h-4 w-4 mr-2 ${
                            loading ? "animate-spin" : ""
                        }`}
                    />
                    Atualizar
                </Button>
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Buscar por título, descrição ou habilidades..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                >
                    <SelectTrigger className="w-full md:w-48">
                        <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as categorias</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                    <SelectTrigger className="w-full md:w-32">
                        <SelectValue placeholder="Orçamento" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="low">Até R$ 1k</SelectItem>
                        <SelectItem value="medium">R$ 1k - 5k</SelectItem>
                        <SelectItem value="high">R$ 5k+</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-primary mr-2" />
                    <span>Carregando jobs disponíveis...</span>
                </div>
            ) : error ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <p className="text-red-500">{error}</p>
                        <Button onClick={handleRefresh} className="mt-4">
                            Tentar novamente
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="text-sm text-gray-600">
                        {filteredJobs.length} job
                        {filteredJobs.length !== 1 ? "s" : ""} encontrado
                        {filteredJobs.length !== 1 ? "s" : ""}
                    </div>

                    <div className="grid gap-6">
                        {filteredJobs.map((job) => (
                            <Card
                                key={job.id}
                                className="hover:shadow-md transition-shadow"
                            >
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                    {job.title}
                                                </h3>
                                                <p className="text-gray-600 leading-relaxed">
                                                    {job.description}
                                                </p>
                                            </div>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="ml-4"
                                            >
                                                <Heart className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {job.skills &&
                                                job.skills.map((skill) => (
                                                    <Badge
                                                        key={skill}
                                                        variant="outline"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ))}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                            <div className="flex items-center text-gray-600">
                                                <DollarSign className="h-4 w-4 mr-1" />
                                                R$ {job.budget.toLocaleString()}
                                                <span className="ml-1 text-gray-500">
                                                    {job.projectType === "fixed"
                                                        ? "(fixo)"
                                                        : "(por hora)"}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {new Date(
                                                    job.deadline
                                                ).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center text-gray-600">
                                                <Users className="h-4 w-4 mr-1" />
                                                {job.proposals} propostas
                                            </div>
                                            <div className="text-gray-600">
                                                Nível:{" "}
                                                {getExperienceText(
                                                    job.experience
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t">
                                            <div className="flex items-center space-x-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src={job.client?.avatar}
                                                    />
                                                    <AvatarFallback>
                                                        {job.client?.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {job.client?.name}
                                                    </p>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                                        <MapPin className="h-3 w-3" />
                                                        <span>
                                                            {
                                                                job.client
                                                                    ?.location
                                                            }
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {job.client
                                                                ? `⭐ ${
                                                                      job.client
                                                                          .rating ||
                                                                      4.5
                                                                  }`
                                                                : "⭐ 4.5"}
                                                        </span>
                                                        <span>•</span>
                                                        <span>
                                                            {job.client
                                                                ? `${
                                                                      job.client
                                                                          .jobsPosted ||
                                                                      5
                                                                  } jobs`
                                                                : "5 jobs"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex space-x-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        navigate(
                                                            `/jobs/${job.id}`
                                                        )
                                                    }
                                                >
                                                    <Eye className="h-4 w-4 mr-1" />
                                                    Ver Detalhes
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        handleAcceptJob(job.id)
                                                    }
                                                >
                                                    Aceitar Job
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="text-xs text-gray-500">
                                            Publicado em{" "}
                                            {new Date(
                                                job.postedAt
                                            ).toLocaleDateString()}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredJobs.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-12">
                                <p className="text-gray-500">
                                    Nenhum job encontrado com os filtros
                                    selecionados.
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setCategoryFilter("all");
                                        setBudgetFilter("all");
                                    }}
                                >
                                    Limpar Filtros
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
};

export default FreelancerJobs;
