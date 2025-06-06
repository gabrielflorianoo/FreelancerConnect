import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../../components/ui/tabs";
import { useAuthStore } from "../../store/authStore";
import { useToast } from "../../hooks/use-toast";
import { Eye, EyeOff, UserPlus, Users, Briefcase } from "lucide-react";
import { userAPI } from "@/server/api";

const Register = () => {
    const [searchParams] = useSearchParams();
    const initialUserType = searchParams.get("type") as
        | "CLIENT"
        | "FREELANCER"
        | null;

    const [userType, setUserType] = useState<"CLIENT" | "FREELANCER">(
        initialUserType || "CLIENT"
    );
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { setUser } = useAuthStore();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Erro na validação",
                description: "As senhas não coincidem.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await userAPI.createUser({
                email: formData.email,
                password: formData.password,
                name: formData.name,
                role: userType.toUpperCase() as "CLIENT" | "FREELANCER",
            });

            setUser(response.data.user);

            toast({
                title: "Conta criada com sucesso!",
                description: `Bem-vindo ao FreelancerConnect, ${formData.name}!`,
            });

            // Redirect based on user type
            navigate(
                userType === "CLIENT"
                    ? "/client/dashboard"
                    : "/freelancer/dashboard"
            );
        } catch (error) {
            console.error("Error during registration:", error);
            toast({
                title: "Erro no registro",
                description: "Tente novamente em alguns instantes.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white p-3 rounded-xl mx-auto w-fit mb-4">
                        <UserPlus className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Criar nova conta
                    </h2>
                    <p className="mt-2 text-gray-600">
                        Junte-se à comunidade FreelancerConnect
                    </p>
                </div>

                <Card className="animate-fade-in">
                    <CardHeader>
                        <CardTitle>Registro</CardTitle>
                        <CardDescription>
                            Escolha seu tipo de conta e preencha suas
                            informações
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs
                            value={userType}
                            onValueChange={(value) =>
                                setUserType(value as "CLIENT" | "FREELANCER")
                            }
                        >
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger
                                    value="CLIENT"
                                    className="flex items-center"
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    Cliente
                                </TabsTrigger>
                                <TabsTrigger
                                    value="FREELANCER"
                                    className="flex items-center"
                                >
                                    <Briefcase className="mr-2 h-4 w-4" />
                                    Freelancer
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="client" className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-blue-900 mb-2">
                                        Conta de Cliente
                                    </h3>
                                    <p className="text-sm text-blue-700">
                                        Ideal para empresas e pessoas que
                                        precisam contratar serviços de
                                        freelancers.
                                    </p>
                                </div>
                            </TabsContent>

                            <TabsContent
                                value="freelancer"
                                className="space-y-4"
                            >
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h3 className="font-medium text-green-900 mb-2">
                                        Conta de Freelancer
                                    </h3>
                                    <p className="text-sm text-green-700">
                                        Para profissionais que desejam oferecer
                                        seus serviços e encontrar novos
                                        clientes.
                                    </p>
                                </div>
                            </TabsContent>
                        </Tabs>

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6 mt-6"
                        >
                            <div>
                                <Label htmlFor="name">Nome completo</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Seu nome completo"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                password: e.target.value,
                                            })
                                        }
                                        required
                                        minLength={6}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="confirmPassword">
                                    Confirmar senha
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                confirmPassword: e.target.value,
                                            })
                                        }
                                        required
                                        minLength={6}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                !showConfirmPassword
                                            )
                                        }
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="terms"
                                        name="terms"
                                        type="checkbox"
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                        required
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label
                                        htmlFor="terms"
                                        className="text-gray-600"
                                    >
                                        Concordo com os{" "}
                                        <Link
                                            to="/terms"
                                            className="text-primary-600 hover:text-primary-500"
                                        >
                                            Termos de Uso
                                        </Link>{" "}
                                        e{" "}
                                        <Link
                                            to="/privacy"
                                            className="text-primary-600 hover:text-primary-500"
                                        >
                                            Política de Privacidade
                                        </Link>
                                    </label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? "Criando conta..." : "Criar conta"}
                            </Button>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300" />
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        Já tem uma conta?
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    asChild
                                >
                                    <Link to="/login">Fazer login</Link>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Register;
