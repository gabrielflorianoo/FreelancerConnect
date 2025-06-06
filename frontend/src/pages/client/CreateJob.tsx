import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
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
import { Badge } from "../../components/ui/badge";
import { toast } from "../../components/ui/use-toast";
import { X, Plus, Loader2 } from "lucide-react";
import { jobsAPI } from "@/server/api";
import { useAuthStore } from "@/store/authStore";
import { Job } from "@/types";

const CreateJob = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<Partial<Job>>({
        title: "",
        description: "",
        category: "",
        budget: "" as string | number,
        location: user?.location || "",
        skills: [] as string[],
        experience: "",
        deadline: "" as string | null,
    });
    const [newSkill, setNewSkill] = useState("");
    const [formErrors, setFormErrors] = useState<{
        title?: string;
        description?: string;
        category?: string;
        budget?: string;
        deadline?: string;
    }>({});

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

    const handleAddSkill = () => {
        if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
            setFormData((prev) => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()],
            }));
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (skill: string) => {
        setFormData((prev) => ({
            ...prev,
            skills: prev.skills.filter((s) => s !== skill),
        }));
    };

    const validateForm = () => {
        const errors: {
            title?: string;
            description?: string;
            category?: string;
            budget?: string;
        } = {};
        
        if (!formData.title.trim()) {
            errors.title = "O título é obrigatório";
        }
        
        if (!formData.description.trim()) {
            errors.description = "A descrição é obrigatória";
        }
        
        if (!formData.category) {
            errors.category = "A categoria é obrigatória";
        }
        
        if (!formData.budget) {
            errors.budget = "O orçamento é obrigatório";
        } else if (isNaN(parseFloat(formData.budget as string)) || parseFloat(formData.budget as string) <= 0) {
            errors.budget = "O orçamento deve ser um valor positivo";
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            toast({
                title: "Erro",
                description: "Você precisa estar logado para criar um job.",
                variant: "destructive",
            });
            navigate("/login");
            return;
        }
        
        if (!validateForm()) {
            toast({
                title: "Erro de validação",
                description: "Por favor, corrija os erros no formulário.",
                variant: "destructive",
            });
            return;
        }
        
        try {
            setLoading(true);
            
            // Converte o preço para número
            const jobData = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                budget: parseFloat(formData.budget as string),
                location: formData.location || user.location || "Remoto",
                deadline: formData.deadline || null,
            };
            
            const response = await jobsAPI.createJob(jobData);
            
            toast({
                title: "Sucesso!",
                description: "Seu job foi criado com sucesso.",
            });
            
            navigate("/client/jobs");
        } catch (error) {
            console.error("Erro ao criar job:", error);
            toast({
                title: "Erro",
                description: "Erro ao criar job: " + (error instanceof Error ? error.message : "Erro desconhecido"),
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Criar Novo Job
                </h1>
                <p className="text-gray-600">
                    Descreva seu projeto e encontre o freelancer ideal
                </p>
                <div className="mt-2 p-3 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
                    <p className="text-sm">
                        <strong>Nota:</strong> Os campos de habilidades e nível de experiência são apenas para referência e serão implementados em uma versão futura do backend.
                    </p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Detalhes do Projeto</CardTitle>
                    <CardDescription>
                        Forneça informações detalhadas sobre seu projeto
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título do Projeto</Label>
                            <Input
                                id="title"
                                placeholder="Ex: Desenvolvimento de site responsivo"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        title: e.target.value,
                                    }))
                                }
                                required
                                className={formErrors.title ? "border-red-500" : ""}
                            />
                            {formErrors.title && (
                                <p className="text-sm text-red-500 mt-1">{formErrors.title}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Descrição</Label>
                            <Textarea
                                id="description"
                                placeholder="Descreva detalhadamente o que você precisa..."
                                className={`min-h-32 ${formErrors.description ? "border-red-500" : ""}`}
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                required
                            />
                            {formErrors.description && (
                                <p className="text-sm text-red-500 mt-1">{formErrors.description}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="category">Categoria</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            category: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger className={formErrors.category ? "border-red-500" : ""}>
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem
                                                key={category}
                                                value={category}
                                            >
                                                {category}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {formErrors.category && (
                                    <p className="text-sm text-red-500 mt-1">{formErrors.category}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="experience">
                                    Nível de Experiência
                                </Label>
                                <Select
                                    value={formData.experience}
                                    onValueChange={(value) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            experience: value,
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o nível" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="iniciante">
                                            Iniciante
                                        </SelectItem>
                                        <SelectItem value="intermediario">
                                            Intermediário
                                        </SelectItem>
                                        <SelectItem value="avancado">
                                            Avançado
                                        </SelectItem>
                                        <SelectItem value="especialista">
                                            Especialista
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="budget">Orçamento (R$)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="5000"
                                    value={formData.budget}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            budget: e.target.value,
                                        }))
                                    }
                                    className={formErrors.budget ? "border-red-500" : ""}
                                    required
                                />
                                {formErrors.budget && (
                                    <p className="text-sm text-red-500 mt-1">{formErrors.budget}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="location">Localização</Label>
                                <Input
                                    id="location"
                                    type="text"
                                    placeholder="Remoto ou localização física"
                                    value={formData.location}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            location: e.target.value,
                                        }))
                                    }
                                />
                                <p className="text-xs text-gray-500">
                                    Deixe em branco para usar sua localização padrão ou "Remoto"
                                </p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deadline">Prazo de Entrega</Label>
                            <Input
                                id="deadline"
                                type="date"
                                value={formData.deadline || ""}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        deadline: e.target.value,
                                    }))
                                }
                            />
                            <p className="text-xs text-gray-500">
                                Data limite para entrega do projeto (opcional)
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Habilidades Necessárias</Label>
                            <div className="flex space-x-2">
                                <Input
                                    placeholder="Ex: React, Node.js, Design..."
                                    value={newSkill}
                                    onChange={(e) =>
                                        setNewSkill(e.target.value)
                                    }
                                    onKeyPress={(e) =>
                                        e.key === "Enter" &&
                                        (e.preventDefault(), handleAddSkill())
                                    }
                                />
                                <Button type="button" onClick={handleAddSkill}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            {formData.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.skills.map((skill) => (
                                        <Badge
                                            key={skill}
                                            variant="secondary"
                                            className="flex items-center space-x-1"
                                        >
                                            <span>{skill}</span>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleRemoveSkill(skill)
                                                }
                                                className="ml-1 hover:text-destructive"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex space-x-4">
                            <Button type="submit" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? "Publicando..." : "Publicar Job"}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/client/jobs")}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateJob;
