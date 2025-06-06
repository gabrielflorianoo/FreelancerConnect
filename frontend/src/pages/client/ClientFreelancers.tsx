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
    Star,
    MapPin,
    DollarSign,
    MessageSquare,
    Heart,
    Filter,
    Loader2,
    RefreshCw
} from "lucide-react";
import { userAPI } from "@/server/api";
import { FreelancerProfile, Review } from "@/types";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface FreelancerWithReviews extends FreelancerProfile {
    reviews?: { id: string; rating: number; comment?: string }[];
    jobsTaken?: { id: string; status: string }[];
}

const ClientFreelancers = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [ratingFilter, setRatingFilter] = useState("all");
    const [freelancers, setFreelancers] = useState<FreelancerWithReviews[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshKey, setRefreshKey] = useState(0); // Para forçar o recarregamento
    
    useEffect(() => {
        fetchFreelancers();
    }, [categoryFilter, ratingFilter, refreshKey]); // Adiciona refreshKey para recarregar quando necessário
    
    const handleRefresh = () => {
        setRefreshKey(prevKey => prevKey + 1);
    };
    
    const fetchFreelancers = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const filters: {
                category?: string;
                rating?: string;
                location?: string;
            } = {};
            
            if (categoryFilter !== "all") {
                filters.category = categoryFilter;
            }
            
            if (ratingFilter !== "all") {
                filters.rating = ratingFilter.replace("+", "");
            }
            
            const response = await userAPI.getFreelancers(filters);
            
            if (!response.data) {
                throw new Error("Resposta inválida do servidor");
            }
            
            setFreelancers(response.data);
        } catch (err) {
            console.error("Erro ao buscar freelancers:", err);
            setError("Não foi possível carregar os freelancers. Tente novamente mais tarde.");
            toast({
                title: "Erro",
                description: "Não foi possível carregar os freelancers." + 
                    (err instanceof Error ? ` (${err.message})` : ""),
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Mockados para fins de demonstração - remova depois da integração completa
    const mockFreelancers = [
        {
            id: 1,
            name: "Ana Silva",
            title: "Desenvolvedora Full Stack",
            description:
                "Especialista em React, Node.js e TypeScript com 5 anos de experiência...",
            avatar: "",
            rating: 4.9,
            reviews: 47,
            location: "São Paulo, SP",
            hourlyRate: 80,
            availability: "Disponível",
            skills: ["React", "Node.js", "TypeScript", "MongoDB"],
            category: "Desenvolvimento Web",
            completedJobs: 32,
            responseTime: "2 horas",
        },
        {
            id: 2,
            name: "Carlos Santos",
            title: "Designer UX/UI",
            description:
                "Criativo e detalhista, especializado em interfaces modernas e user experience...",
            avatar: "",
            rating: 4.8,
            reviews: 63,
            location: "Rio de Janeiro, RJ",
            hourlyRate: 60,
            availability: "Ocupado",
            skills: ["Figma", "Adobe XD", "Photoshop", "Illustrator"],
            category: "Design Gráfico",
            completedJobs: 45,
            responseTime: "4 horas",
        },
        {
            id: 3,
            name: "Marina Costa",
            title: "Especialista em Marketing Digital",
            description:
                "Gestão de campanhas, SEO, Google Ads e estratégias de crescimento...",
            avatar: "",
            rating: 4.7,
            reviews: 29,
            location: "Belo Horizonte, MG",
            hourlyRate: 50,
            availability: "Disponível",
            skills: ["Google Ads", "SEO", "Facebook Ads", "Analytics"],
            category: "Marketing Digital",
            completedJobs: 28,
            responseTime: "1 hora",
        },
        {
            id: 4,
            name: "João Oliveira",
            title: "Redator e Copywriter",
            description:
                "Especialista em conteúdo para web, blogs e campanhas publicitárias...",
            avatar: "",
            rating: 4.6,
            reviews: 34,
            location: "Porto Alegre, RS",
            hourlyRate: 40,
            availability: "Disponível",
            skills: [
                "Copywriting",
                "SEO Writing",
                "Content Marketing",
                "WordPress",
            ],
            category: "Redação",
            completedJobs: 56,
            responseTime: "3 horas",
        },
    ];

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
    
    // Calcula a avaliação média do freelancer com base nos reviews
    const getFreelancerRating = (freelancer: FreelancerWithReviews) => {
        if (!freelancer.reviews || freelancer.reviews.length === 0) {
            return 0;
        }
        
        const totalRating = freelancer.reviews.reduce((sum, review) => sum + review.rating, 0);
        return totalRating / freelancer.reviews.length;
    };
    
    const getFreelancerReviews = (freelancer: FreelancerWithReviews) => {
        if (!freelancer.reviews) return 0;
        return freelancer.reviews.length;
    };
    
    // Calcula o número de projetos concluídos pelo freelancer
    const getCompletedJobs = (freelancer: FreelancerWithReviews) => {
        if (!freelancer.jobsTaken) return 0;
        
        return freelancer.jobsTaken.filter(job => job.status === "COMPLETED").length;
    };

    // Aplicar filtragem local apenas para o termo de busca,
    // já que os outros filtros são aplicados no backend
    const filteredFreelancers = freelancers.filter((freelancer) => {
        if (!freelancer) return false;
        
        if (searchTerm === "") return true;
        
        // Pesquisa pelo nome
        const nameMatch = freelancer.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Pesquisa pela bio
        const bioMatch = freelancer.bio ? 
            freelancer.bio.toLowerCase().includes(searchTerm.toLowerCase()) : 
            false;
            
        // Pesquisa pelas habilidades/serviços
        const skillMatch = freelancer.services ? 
            freelancer.services.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) :
            false;
            
        // Pesquisa pela localização
        const locationMatch = freelancer.location ?
            freelancer.location.toLowerCase().includes(searchTerm.toLowerCase()) :
            false;
            
        return nameMatch || bioMatch || skillMatch || locationMatch;
    });

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Buscar Freelancers
                    </h1>
                    <p className="text-gray-600">
                        Encontre o profissional ideal para seu projeto
                    </p>
                </div>
                
                <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRefresh} 
                    disabled={loading}
                    className="flex items-center"
                >
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Atualizar
                </Button>
            </div>

            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Buscar por nome, habilidade ou título..."
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
                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                    <SelectTrigger className="w-full md:w-32">
                        <SelectValue placeholder="Avaliação" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        <SelectItem value="4+">4+ estrelas</SelectItem>
                        <SelectItem value="4.5+">4.5+ estrelas</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Carregando freelancers...</span>
                </div>
            ) : error ? (
                <Card>
                    <CardContent className="text-center py-12">
                        <p className="text-red-500">{error}</p>
                        <Button 
                            onClick={fetchFreelancers} 
                            className="mt-4"
                        >
                            Tentar novamente
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <>
                    <div className="text-sm text-gray-600">
                        {filteredFreelancers.length} freelancer
                        {filteredFreelancers.length !== 1 ? "s" : ""} encontrado
                        {filteredFreelancers.length !== 1 ? "s" : ""}
                    </div>

                    <div className="grid gap-6">
                        {filteredFreelancers.map((freelancer) => (
                    <Card
                        key={freelancer.id}
                        className="hover:shadow-md transition-shadow"
                    >
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                                <div className="flex-shrink-0">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={freelancer.avatarUrl} />
                                        <AvatarFallback>
                                            {freelancer.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {freelancer.name}
                                            </h3>
                                            <p className="text-primary-600 font-medium">
                                                {freelancer.services && freelancer.services.length > 0 
                                                    ? freelancer.services[0] 
                                                    : "Freelancer"}
                                            </p>
                                            <p className="text-gray-600 mt-1">
                                                {freelancer.bio || "Nenhuma descrição disponível."}
                                            </p>
                                        </div>

                                        <div className="flex flex-col md:items-end space-y-2 mt-4 md:mt-0">
                                            <div className="flex items-center space-x-1">
                                                {getFreelancerRating(freelancer) > 0 ? (
                                                    <>
                                                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                                        <span className="font-medium">
                                                            {getFreelancerRating(freelancer).toFixed(1)}
                                                        </span>
                                                        <span className="text-gray-500">
                                                            ({getFreelancerReviews(freelancer)}{" "}
                                                            {getFreelancerReviews(freelancer) === 1 ? "avaliação" : "avaliações"})
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-gray-500">
                                                        Sem avaliações
                                                    </span>
                                                )}
                                            </div>
                                            <Badge
                                                variant={getCompletedJobs(freelancer) > 0 ? "default" : "secondary"}
                                            >
                                                {getCompletedJobs(freelancer) > 0 ? "Experiente" : "Novo profissional"}
                                            </Badge>
                                        </div>
                                    </div>

                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {freelancer.location || "Remoto"}
                                        </div>
                                        <div className="flex items-center">
                                            <DollarSign className="h-4 w-4 mr-1" />
                                            Preço médio por projeto
                                        </div>
                                        <div>
                                            Projetos concluídos:{" "}
                                            {getCompletedJobs(freelancer)}
                                        </div>
                                        <div>
                                            Membro desde:{" "}
                                            {new Date(freelancer.createdAt).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex flex-wrap gap-2">
                                            {freelancer.services && freelancer.services.map((skill) => (
                                                <Badge
                                                    key={skill}
                                                    variant="outline"
                                                >
                                                    {skill}
                                                </Badge>
                                            ))}
                                            {(!freelancer.services || freelancer.services.length === 0) && (
                                                <Badge variant="outline">Sem habilidades listadas</Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex space-x-2">
                                        <Button 
                                            onClick={() => {
                                                toast({
                                                    title: "Em breve",
                                                    description: "Funcionalidade de mensagens será implementada em breve.",
                                                });
                                            }}
                                        >
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Enviar Mensagem
                                        </Button>
                                        <Button 
                                            variant="outline"
                                            onClick={() => navigate(`/profile/${freelancer.id}`)}
                                        >
                                            Ver Perfil Completo
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="icon"
                                            onClick={() => {
                                                toast({
                                                    title: "Em breve",
                                                    description: "Funcionalidade de favoritos será implementada em breve.",
                                                });
                                            }}
                                        >
                                            <Heart className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

                    {filteredFreelancers.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-12">
                                <p className="text-gray-500">
                                    Nenhum freelancer encontrado com os filtros
                                    selecionados.
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => {
                                        setSearchTerm("");
                                        setCategoryFilter("all");
                                        setRatingFilter("all");
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

export default ClientFreelancers;
