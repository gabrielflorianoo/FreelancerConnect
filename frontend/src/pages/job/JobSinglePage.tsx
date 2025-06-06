import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    Loader2,
    Clock,
    DollarSign,
    Users,
    MapPin,
    MessageSquare,
    ArrowLeft,
} from "lucide-react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";

import { jobsAPI } from "@/server/api";


interface Job {
    id: string;
    title: string;
    description: string;
    category: string;
    location: string;
    budget: number;
    deadline: string | null;
    status: string;
    client: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
    freelancer?: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
    skills?: string[];
    proposals?: number;
    createdAt: string;
    updatedAt: string;
}

const statusLabels: Record<string, string> = {
    PENDING: "Aberto",
    ACCEPTED: "Em Andamento",
    COMPLETED: "Concluído",
    CANCELLED: "Cancelado",
};

const JobSinglePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await jobsAPI.getJobById(id!);
                setJob(response.data);
            } catch (err) {
                setError("Não foi possível carregar o job.");
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Carregando job...</span>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="flex flex-col items-center py-20">
                <p className="text-red-500">{error || "Job não encontrado."}</p>
                <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Voltar
                </Button>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <Button variant="ghost" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
            </Button>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <Badge variant="secondary" className="mb-2">
                                {job.category}
                            </Badge>
                            <CardTitle className="text-2xl">
                                {job.title}
                            </CardTitle>
                            <CardDescription className="flex items-center mt-2 text-gray-600">
                                <MapPin className="h-4 w-4 mr-1" />
                                {job.location}
                            </CardDescription>
                        </div>
                        <Badge className="ml-4">
                            {statusLabels[job.status] || job.status}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                                <DollarSign className="h-4 w-4 mr-1" />
                                <span>
                                    R$ {job.budget?.toLocaleString("pt-BR")}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>
                                    Deadline:{" "}
                                    {job.deadline
                                        ? new Date(
                                              job.deadline
                                          ).toLocaleDateString()
                                        : "Não definido"}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Users className="h-4 w-4 mr-1" />
                                <span>
                                    {job.freelancer
                                        ? job.freelancer.name
                                        : `${job.proposals || 0} propostas`}
                                </span>
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">
                                Descrição do Projeto
                            </h3>
                            <p className="text-gray-800">{job.description}</p>
                        </div>
                        {job.skills && job.skills.length > 0 && (
                            <div className="mt-4">
                                <h4 className="font-semibold mb-2">
                                    Habilidades Desejadas
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills.map((skill) => (
                                        <Badge key={skill} variant="outline">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="mt-6 flex flex-col md:flex-row gap-6">
                            <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                    <AvatarImage src={job.client.avatarUrl} />
                                    <AvatarFallback>
                                        {job.client.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="font-medium">
                                        {job.client.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        Cliente
                                    </div>
                                </div>
                            </div>
                            {job.freelancer && (
                                <div className="flex items-center">
                                    <Avatar className="h-10 w-10 mr-3">
                                        <AvatarImage
                                            src={job.freelancer.avatarUrl}
                                        />
                                        <AvatarFallback>
                                            {job.freelancer.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium">
                                            {job.freelancer.name}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Freelancer
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="mt-8 flex gap-2">
                            <Button variant="outline">
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Mensagens
                            </Button>
                            {/* Adicione outras ações conforme necessário */}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default JobSinglePage;
