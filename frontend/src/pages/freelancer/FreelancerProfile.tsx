import { useState } from "react";
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
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
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
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs";
import {
    User,
    Star,
    MapPin,
    Globe,
    Phone,
    Mail,
    Calendar,
    DollarSign,
    Edit,
    Plus,
    X,
    Save,
    Camera,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const FreelancerProfile = () => {
    const { user } = useAuthStore();
    const [isEditing, setIsEditing] = useState(false);
    const [newSkill, setNewSkill] = useState("");
    const [newPortfolioItem, setNewPortfolioItem] = useState({
        title: "",
        description: "",
        image: "",
    });

    const [profile, setProfile] = useState({
        name: user?.name || "Maria Santos",
        title: "Desenvolvedora Full Stack",
        bio: "Desenvolvedora apaixonada por tecnologia com 5 anos de experiência em React, Node.js e TypeScript. Especializada em criar soluções web modernas e eficientes.",
        location: "São Paulo, SP",
        hourlyRate: 80,
        availability: "Disponível",
        website: "https://mariasantos.dev",
        phone: "(11) 99999-9999",
        email: user?.email || "maria@exemplo.com",
        joinDate: "2022-03-15",
        skills: [
            "React",
            "Node.js",
            "TypeScript",
            "MongoDB",
            "PostgreSQL",
            "AWS",
            "Docker",
            "GraphQL",
        ],
        languages: [
            { language: "Português", level: "Nativo" },
            { language: "Inglês", level: "Fluente" },
            { language: "Espanhol", level: "Intermediário" },
        ],
        education: [
            {
                degree: "Bacharel em Ciência da Computação",
                institution: "Universidade de São Paulo",
                year: "2018",
            },
        ],
        certifications: [
            "AWS Certified Developer",
            "React Professional Certificate",
            "Node.js Certified Developer",
        ],
    });

    const [stats] = useState({
        totalJobs: 28,
        completedJobs: 25,
        rating: 4.9,
        reviews: 23,
        responseTime: "2 horas",
        repeatClients: 85,
    });

    const [portfolio] = useState([
        {
            id: 1,
            title: "E-commerce Platform",
            description:
                "Plataforma completa de e-commerce desenvolvida com React e Node.js",
            image: "",
            technologies: ["React", "Node.js", "MongoDB", "Stripe"],
            url: "https://exemplo.com",
        },
        {
            id: 2,
            title: "Dashboard Analytics",
            description:
                "Dashboard interativo para análise de dados com gráficos em tempo real",
            image: "",
            technologies: ["React", "TypeScript", "D3.js", "PostgreSQL"],
            url: "https://exemplo.com",
        },
        {
            id: 3,
            title: "Mobile App",
            description:
                "Aplicativo móvel para gestão de tarefas com sincronização em nuvem",
            image: "",
            technologies: ["React Native", "Firebase", "Redux"],
            url: "https://exemplo.com",
        },
    ]);

    const [reviews] = useState([
        {
            id: 1,
            client: "João Silva",
            rating: 5,
            comment:
                "Excelente profissional! Entregou o projeto antes do prazo e com qualidade excepcional.",
            project: "Desenvolvimento de E-commerce",
            date: "2023-12-10",
        },
        {
            id: 2,
            client: "Ana Costa",
            rating: 5,
            comment: "Muito competente e comunicativa. Recomendo sem dúvidas!",
            project: "Dashboard Analytics",
            date: "2023-11-25",
        },
        {
            id: 3,
            client: "Pedro Santos",
            rating: 4,
            comment:
                "Ótimo trabalho, profissional dedicada e atenciosa aos detalhes.",
            project: "App Mobile",
            date: "2023-11-10",
        },
    ]);

    const handleAddSkill = () => {
        if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
            setProfile((prev) => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()],
            }));
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (skill: string) => {
        setProfile((prev) => ({
            ...prev,
            skills: prev.skills.filter((s) => s !== skill),
        }));
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-4 w-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Meu Perfil
                    </h1>
                    <p className="text-gray-600">
                        Gerencie suas informações profissionais
                    </p>
                </div>
                <Button
                    onClick={() => setIsEditing(!isEditing)}
                    variant={isEditing ? "outline" : "default"}
                >
                    <Edit className="h-4 w-4 mr-2" />
                    {isEditing ? "Cancelar" : "Editar Perfil"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sidebar - Informações Básicas */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6 text-center">
                            <div className="relative inline-block">
                                <Avatar className="h-24 w-24 mx-auto">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="text-xl">
                                        {profile.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                {isEditing && (
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                                    >
                                        <Camera className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            <h2 className="text-xl font-bold text-gray-900 mt-4">
                                {profile.name}
                            </h2>
                            <p className="text-primary-600 font-medium">
                                {profile.title}
                            </p>

                            <div className="flex items-center justify-center space-x-1 mt-2">
                                {renderStars(Math.round(stats.rating))}
                                <span className="ml-2 text-sm text-gray-600">
                                    {stats.rating} ({stats.reviews} avaliações)
                                </span>
                            </div>

                            <div className="flex items-center justify-center text-gray-600 mt-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                {profile.location}
                            </div>

                            <Badge
                                variant={
                                    profile.availability === "Disponível"
                                        ? "default"
                                        : "secondary"
                                }
                                className="mt-3"
                            >
                                {profile.availability}
                            </Badge>
                        </CardContent>
                    </Card>

                    {/* Estatísticas */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Estatísticas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <div className="text-2xl font-bold text-primary-600">
                                        {stats.completedJobs}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Jobs Concluídos
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-primary-600">
                                        {stats.rating}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Avaliação Média
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-primary-600">
                                        {stats.responseTime}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Tempo Resposta
                                    </div>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold text-primary-600">
                                        {stats.repeatClients}%
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Clientes Recorrentes
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contato */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Contato</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center text-sm">
                                <Mail className="h-4 w-4 mr-2 text-gray-400" />
                                {profile.email}
                            </div>
                            <div className="flex items-center text-sm">
                                <Phone className="h-4 w-4 mr-2 text-gray-400" />
                                {profile.phone}
                            </div>
                            <div className="flex items-center text-sm">
                                <Globe className="h-4 w-4 mr-2 text-gray-400" />
                                <a
                                    href={profile.website}
                                    className="text-primary-600 hover:underline"
                                >
                                    {profile.website}
                                </a>
                            </div>
                            <div className="flex items-center text-sm">
                                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                Membro desde{" "}
                                {new Date(
                                    profile.joinDate,
                                ).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-sm">
                                <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                                R$ {profile.hourlyRate}/hora
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Conteúdo Principal */}
                <div className="lg:col-span-2 space-y-6">
                    <Tabs defaultValue="about" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="about">Sobre</TabsTrigger>
                            <TabsTrigger value="portfolio">
                                Portfólio
                            </TabsTrigger>
                            <TabsTrigger value="reviews">
                                Avaliações
                            </TabsTrigger>
                            <TabsTrigger value="skills">
                                Habilidades
                            </TabsTrigger>
                        </TabsList>

                        {/* Aba Sobre */}
                        <TabsContent value="about" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sobre Mim</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {isEditing ? (
                                        <Textarea
                                            value={profile.bio}
                                            onChange={(e) =>
                                                setProfile((prev) => ({
                                                    ...prev,
                                                    bio: e.target.value,
                                                }))
                                            }
                                            className="min-h-32"
                                        />
                                    ) : (
                                        <p className="text-gray-700 leading-relaxed">
                                            {profile.bio}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Formação</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {profile.education.map((edu, index) => (
                                        <div
                                            key={index}
                                            className="border-l-2 border-primary-200 pl-4 mb-4 last:mb-0"
                                        >
                                            <h3 className="font-medium">
                                                {edu.degree}
                                            </h3>
                                            <p className="text-gray-600">
                                                {edu.institution}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {edu.year}
                                            </p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Certificações</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {profile.certifications.map(
                                            (cert, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="outline"
                                                >
                                                    {cert}
                                                </Badge>
                                            ),
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Idiomas</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        {profile.languages.map(
                                            (lang, index) => (
                                                <div
                                                    key={index}
                                                    className="flex justify-between"
                                                >
                                                    <span>{lang.language}</span>
                                                    <Badge variant="outline">
                                                        {lang.level}
                                                    </Badge>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Aba Portfólio */}
                        <TabsContent value="portfolio" className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">
                                    Meus Projetos
                                </h2>
                                {isEditing && (
                                    <Button size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Adicionar Projeto
                                    </Button>
                                )}
                            </div>

                            <div className="grid gap-6">
                                {portfolio.map((item) => (
                                    <Card key={item.id}>
                                        <CardContent className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-lg font-semibold">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-gray-600 mt-1">
                                                        {item.description}
                                                    </p>
                                                </div>
                                                {isEditing && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {item.technologies.map(
                                                    (tech) => (
                                                        <Badge
                                                            key={tech}
                                                            variant="secondary"
                                                        >
                                                            {tech}
                                                        </Badge>
                                                    ),
                                                )}
                                            </div>

                                            <Button variant="outline" size="sm">
                                                <Globe className="h-4 w-4 mr-2" />
                                                Ver Projeto
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Aba Avaliações */}
                        <TabsContent value="reviews" className="space-y-6">
                            <div>
                                <h2 className="text-xl font-bold mb-4">
                                    Avaliações dos Clientes
                                </h2>
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <Card key={review.id}>
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-medium">
                                                            {review.client}
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            {review.project}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        {renderStars(
                                                            review.rating,
                                                        )}
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            {new Date(
                                                                review.date,
                                                            ).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <p className="text-gray-700">
                                                    {review.comment}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </TabsContent>

                        {/* Aba Habilidades */}
                        <TabsContent value="skills" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Minhas Habilidades</CardTitle>
                                    <CardDescription>
                                        Tecnologias e ferramentas que domino
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {profile.skills.map((skill) => (
                                            <Badge
                                                key={skill}
                                                variant="secondary"
                                                className="flex items-center space-x-1"
                                            >
                                                <span>{skill}</span>
                                                {isEditing && (
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveSkill(
                                                                skill,
                                                            )
                                                        }
                                                        className="ml-1 hover:text-destructive"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                )}
                                            </Badge>
                                        ))}
                                    </div>

                                    {isEditing && (
                                        <div className="flex space-x-2">
                                            <Input
                                                placeholder="Nova habilidade..."
                                                value={newSkill}
                                                onChange={(e) =>
                                                    setNewSkill(e.target.value)
                                                }
                                                onKeyPress={(e) =>
                                                    e.key === "Enter" &&
                                                    (e.preventDefault(),
                                                    handleAddSkill())
                                                }
                                            />
                                            <Button onClick={handleAddSkill}>
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>

                    {isEditing && (
                        <div className="flex space-x-4">
                            <Button onClick={() => setIsEditing(false)}>
                                <Save className="h-4 w-4 mr-2" />
                                Salvar Alterações
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancelar
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FreelancerProfile;
