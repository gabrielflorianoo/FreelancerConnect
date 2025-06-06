import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
    Users,
    Briefcase,
    Star,
    MapPin,
    Clock,
    CheckCircle,
    ArrowRight,
    Zap,
    Shield,
    Heart,
    MessageSquare,
} from "lucide-react";

const Home = () => {
    const featuredJobs = [
        {
            id: 1,
            title: "Desenvolvimento de App Mobile",
            category: "Desenvolvimento",
            budget: "R$ 5.000",
            location: "São Paulo, SP",
            skills: ["React Native", "JavaScript", "UI/UX"],
            deadline: "30 dias",
            proposals: 12,
        },
        {
            id: 2,
            title: "Design de Logo e Identidade Visual",
            category: "Design",
            budget: "R$ 800",
            location: "Rio de Janeiro, RJ",
            skills: ["Adobe Illustrator", "Branding", "Logo Design"],
            deadline: "7 dias",
            proposals: 8,
        },
        {
            id: 3,
            title: "Gestão de Redes Sociais",
            category: "Marketing",
            budget: "R$ 1.200/mês",
            location: "Belo Horizonte, MG",
            skills: ["Social Media", "Content Creation", "Analytics"],
            deadline: "15 dias",
            proposals: 15,
        },
    ];

    const topFreelancers = [
        {
            id: 1,
            name: "Ana Silva",
            title: "Desenvolvedora Full Stack",
            rating: 4.9,
            reviews: 47,
            hourlyRate: 85,
            skills: ["React", "Node.js", "Python"],
            location: "São Paulo, SP",
        },
        {
            id: 2,
            name: "Carlos Santos",
            title: "Designer UI/UX",
            rating: 4.8,
            reviews: 32,
            hourlyRate: 65,
            skills: ["Figma", "Adobe XD", "User Research"],
            location: "Florianópolis, SC",
        },
        {
            id: 3,
            name: "Marina Costa",
            title: "Especialista em Marketing Digital",
            rating: 5.0,
            reviews: 28,
            hourlyRate: 70,
            skills: ["Google Ads", "SEO", "Analytics"],
            location: "Porto Alegre, RS",
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                            Conecte-se com os melhores
                            <span className="block text-secondary-200">
                                freelancers da sua região
                            </span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto animate-fade-in">
                            Encontre profissionais qualificados ou ofereça seus
                            serviços na maior plataforma de freelancers
                            regionais do Brasil.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
                            <Button
                                asChild
                                size="lg"
                                className="bg-white text-primary-600 hover:bg-gray-100"
                            >
                                <Link to="/register?type=client">
                                    <Users className="mr-2 h-5 w-5" />
                                    Sou Cliente
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="border-white text-white hover:bg-white hover:text-primary-600"
                            >
                                <Link to="/register?type=freelancer">
                                    <Briefcase className="mr-2 h-5 w-5" />
                                    Sou Freelancer
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="animate-fade-in">
                            <div className="text-3xl font-bold text-primary-600 mb-2">
                                1.2K+
                            </div>
                            <div className="text-gray-600">
                                Freelancers Ativos
                            </div>
                        </div>
                        <div className="animate-fade-in">
                            <div className="text-3xl font-bold text-primary-600 mb-2">
                                850+
                            </div>
                            <div className="text-gray-600">Jobs Concluídos</div>
                        </div>
                        <div className="animate-fade-in">
                            <div className="text-3xl font-bold text-primary-600 mb-2">
                                4.8
                            </div>
                            <div className="text-gray-600">Avaliação Média</div>
                        </div>
                        <div className="animate-fade-in">
                            <div className="text-3xl font-bold text-primary-600 mb-2">
                                15+
                            </div>
                            <div className="text-gray-600">
                                Cidades Atendidas
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Jobs */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Jobs em Destaque
                        </h2>
                        <p className="text-xl text-gray-600">
                            Oportunidades incríveis esperando por você
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {featuredJobs.map((job) => (
                            <Card
                                key={job.id}
                                className="card-hover animate-fade-in"
                            >
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="secondary">
                                            {job.category}
                                        </Badge>
                                        <span className="text-sm text-gray-500">
                                            {job.proposals} propostas
                                        </span>
                                    </div>
                                    <CardTitle className="text-lg line-clamp-2">
                                        {job.title}
                                    </CardTitle>
                                    <CardDescription className="flex items-center text-gray-600">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {job.location}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-lg font-semibold text-primary-600">
                                                {job.budget}
                                            </span>
                                            <span className="text-sm text-gray-500 flex items-center">
                                                <Clock className="h-4 w-4 mr-1" />
                                                {job.deadline}
                                            </span>
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
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                        >
                                            Ver Detalhes
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Button asChild size="lg">
                            <Link to="/jobs">Ver Todos os Jobs</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Top Freelancers */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Freelancers em Destaque
                        </h2>
                        <p className="text-xl text-gray-600">
                            Profissionais de alta qualidade prontos para seus
                            projetos
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {topFreelancers.map((freelancer) => (
                            <Card
                                key={freelancer.id}
                                className="card-hover animate-fade-in"
                            >
                                <CardHeader className="text-center">
                                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                                        {freelancer.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </div>
                                    <CardTitle className="text-lg">
                                        {freelancer.name}
                                    </CardTitle>
                                    <CardDescription>
                                        {freelancer.title}
                                    </CardDescription>
                                    <div className="flex items-center justify-center space-x-2 text-sm">
                                        <div className="flex items-center text-yellow-500">
                                            <Star className="h-4 w-4 fill-current" />
                                            <span className="ml-1 font-medium">
                                                {freelancer.rating}
                                            </span>
                                        </div>
                                        <span className="text-gray-500">
                                            ({freelancer.reviews} avaliações)
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="text-center">
                                            <span className="text-lg font-semibold text-primary-600">
                                                R$ {freelancer.hourlyRate}/hora
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center text-sm text-gray-600">
                                            <MapPin className="h-4 w-4 mr-1" />
                                            {freelancer.location}
                                        </div>
                                        <div className="flex flex-wrap gap-1 justify-center">
                                            {freelancer.skills.map((skill) => (
                                                <Badge
                                                    key={skill}
                                                    variant="outline"
                                                    className="text-xs"
                                                >
                                                    {skill}
                                                </Badge>
                                            ))}
                                        </div>
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                        >
                                            Ver Perfil
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <Button asChild size="lg">
                            <Link to="/freelancers">
                                Ver Todos os Freelancers
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Por que escolher o FreelancerConnect?
                        </h2>
                        <p className="text-xl text-gray-600">
                            A plataforma que faz a diferença para sua carreira
                            ou negócio
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="text-center animate-fade-in">
                            <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <MapPin className="h-8 w-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Conexão Regional
                            </h3>
                            <p className="text-gray-600">
                                Conecte-se com profissionais da sua região para
                                projetos mais eficientes e reuniões presenciais
                                quando necessário.
                            </p>
                        </div>

                        <div className="text-center animate-fade-in">
                            <div className="w-16 h-16 bg-secondary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Shield className="h-8 w-8 text-secondary-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Pagamentos Seguros
                            </h3>
                            <p className="text-gray-600">
                                Sistema de pagamentos protegido com garantia
                                para clientes e freelancers. Seus recursos ficam
                                seguros até a conclusão do trabalho.
                            </p>
                        </div>

                        <div className="text-center animate-fade-in">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Star className="h-8 w-8 text-yellow-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Qualidade Garantida
                            </h3>
                            <p className="text-gray-600">
                                Sistema de avaliações transparente e verificação
                                de freelancers para garantir a melhor
                                experiência para todos.
                            </p>
                        </div>

                        <div className="text-center animate-fade-in">
                            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Zap className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Processo Ágil
                            </h3>
                            <p className="text-gray-600">
                                Encontre o profissional ideal rapidamente com
                                nosso sistema inteligente de matching e filtros
                                avançados.
                            </p>
                        </div>

                        <div className="text-center animate-fade-in">
                            <div className="w-16 h-16 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <MessageSquare className="h-8 w-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Comunicação Direta
                            </h3>
                            <p className="text-gray-600">
                                Chat integrado para comunicação eficiente entre
                                clientes e freelancers durante todo o projeto.
                            </p>
                        </div>

                        <div className="text-center animate-fade-in">
                            <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <Heart className="h-8 w-8 text-red-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                                Suporte Dedicado
                            </h3>
                            <p className="text-gray-600">
                                Equipe de suporte sempre disponível para ajudar
                                em qualquer etapa do seu projeto ou carreira
                                freelancer.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-16">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Pronto para começar sua jornada?
                    </h2>
                    <p className="text-xl mb-8 text-primary-100">
                        Junte-se a milhares de profissionais que já encontraram
                        sucesso no FreelancerConnect
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-white text-primary-600 hover:bg-gray-100"
                        >
                            <Link to="/register">
                                <CheckCircle className="mr-2 h-5 w-5" />
                                Criar Conta Gratuita
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
