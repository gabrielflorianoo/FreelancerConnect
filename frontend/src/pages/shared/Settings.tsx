import { useState } from "react";
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
import { Switch } from "../../components/ui/switch";
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
    Bell,
    Shield,
    CreditCard,
    Globe,
    Camera,
    Save,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const Settings = () => {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        bio: "",
        location: "",
        website: "",
        hourlyRate: "",
        availability: "available",
    });

    const [notifications, setNotifications] = useState({
        emailMessages: true,
        emailProposals: true,
        emailPayments: true,
        pushMessages: false,
        pushProposals: true,
        pushPayments: true,
    });

    const [privacy, setPrivacy] = useState({
        profileVisibility: "public",
        showEmail: false,
        showPhone: false,
        showRating: true,
    });

    const handleSaveProfile = () => {
        console.log("Salvando perfil:", profile);
        // Aqui você salvaria no backend
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    Configurações
                </h1>
                <p className="text-gray-600">
                    Gerencie suas preferências e informações da conta
                </p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="profile">Perfil</TabsTrigger>
                    <TabsTrigger value="notifications">
                        Notificações
                    </TabsTrigger>
                    <TabsTrigger value="privacy">Privacidade</TabsTrigger>
                    <TabsTrigger value="billing">Faturamento</TabsTrigger>
                </TabsList>

                {/* Aba Perfil */}
                <TabsContent value="profile" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="h-5 w-5 mr-2" />
                                Informações Pessoais
                            </CardTitle>
                            <CardDescription>
                                Atualize suas informações pessoais e
                                profissionais
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Avatar */}
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src="" />
                                    <AvatarFallback className="text-lg">
                                        {profile.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <Button variant="outline">
                                        <Camera className="h-4 w-4 mr-2" />
                                        Alterar Foto
                                    </Button>
                                    <p className="text-sm text-gray-500 mt-1">
                                        JPG, GIF ou PNG. Máximo 5MB.
                                    </p>
                                </div>
                            </div>

                            {/* Formulário */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nome Completo</Label>
                                    <Input
                                        id="name"
                                        value={profile.name}
                                        onChange={(e) =>
                                            setProfile((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) =>
                                            setProfile((prev) => ({
                                                ...prev,
                                                email: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Telefone</Label>
                                    <Input
                                        id="phone"
                                        value={profile.phone}
                                        onChange={(e) =>
                                            setProfile((prev) => ({
                                                ...prev,
                                                phone: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">
                                        Localização
                                    </Label>
                                    <Input
                                        id="location"
                                        placeholder="Cidade, Estado"
                                        value={profile.location}
                                        onChange={(e) =>
                                            setProfile((prev) => ({
                                                ...prev,
                                                location: e.target.value,
                                            }))
                                        }
                                    />
                                </div>

                                {user?.role === "FREELANCER" && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="hourlyRate">
                                                Valor por Hora (R$)
                                            </Label>
                                            <Input
                                                id="hourlyRate"
                                                type="number"
                                                value={profile.hourlyRate}
                                                onChange={(e) =>
                                                    setProfile((prev) => ({
                                                        ...prev,
                                                        hourlyRate:
                                                            e.target.value,
                                                    }))
                                                }
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="availability">
                                                Disponibilidade
                                            </Label>
                                            <Select
                                                value={profile.availability}
                                                onValueChange={(value) =>
                                                    setProfile((prev) => ({
                                                        ...prev,
                                                        availability: value,
                                                    }))
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="available">
                                                        Disponível
                                                    </SelectItem>
                                                    <SelectItem value="busy">
                                                        Ocupado
                                                    </SelectItem>
                                                    <SelectItem value="unavailable">
                                                        Indisponível
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </>
                                )}

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="website">Website</Label>
                                    <Input
                                        id="website"
                                        placeholder="https://seusite.com"
                                        value={profile.website}
                                        onChange={(e) =>
                                            setProfile((prev) => ({
                                                ...prev,
                                                website: e.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Biografia</Label>
                                <Textarea
                                    id="bio"
                                    placeholder="Conte um pouco sobre você e sua experiência..."
                                    className="min-h-32"
                                    value={profile.bio}
                                    onChange={(e) =>
                                        setProfile((prev) => ({
                                            ...prev,
                                            bio: e.target.value,
                                        }))
                                    }
                                />
                            </div>

                            <Button onClick={handleSaveProfile}>
                                <Save className="h-4 w-4 mr-2" />
                                Salvar Alterações
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Aba Notificações */}
                <TabsContent value="notifications" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Bell className="h-5 w-5 mr-2" />
                                Preferências de Notificação
                            </CardTitle>
                            <CardDescription>
                                Configure como e quando você quer receber
                                notificações
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium mb-4">
                                    Notificações por Email
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Novas mensagens</Label>
                                            <p className="text-sm text-gray-500">
                                                Receba um email quando alguém te
                                                enviar uma mensagem
                                            </p>
                                        </div>
                                        <Switch
                                            checked={
                                                notifications.emailMessages
                                            }
                                            onCheckedChange={(checked) =>
                                                setNotifications((prev) => ({
                                                    ...prev,
                                                    emailMessages: checked,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Novas propostas</Label>
                                            <p className="text-sm text-gray-500">
                                                Notificações sobre propostas
                                                recebidas ou enviadas
                                            </p>
                                        </div>
                                        <Switch
                                            checked={
                                                notifications.emailProposals
                                            }
                                            onCheckedChange={(checked) =>
                                                setNotifications((prev) => ({
                                                    ...prev,
                                                    emailProposals: checked,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Pagamentos</Label>
                                            <p className="text-sm text-gray-500">
                                                Confirmações de pagamento e
                                                recebimentos
                                            </p>
                                        </div>
                                        <Switch
                                            checked={
                                                notifications.emailPayments
                                            }
                                            onCheckedChange={(checked) =>
                                                setNotifications((prev) => ({
                                                    ...prev,
                                                    emailPayments: checked,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium mb-4">
                                    Notificações Push
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Mensagens</Label>
                                            <p className="text-sm text-gray-500">
                                                Notificações instantâneas para
                                                mensagens
                                            </p>
                                        </div>
                                        <Switch
                                            checked={notifications.pushMessages}
                                            onCheckedChange={(checked) =>
                                                setNotifications((prev) => ({
                                                    ...prev,
                                                    pushMessages: checked,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Propostas</Label>
                                            <p className="text-sm text-gray-500">
                                                Alertas sobre atividade de
                                                propostas
                                            </p>
                                        </div>
                                        <Switch
                                            checked={
                                                notifications.pushProposals
                                            }
                                            onCheckedChange={(checked) =>
                                                setNotifications((prev) => ({
                                                    ...prev,
                                                    pushProposals: checked,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Pagamentos</Label>
                                            <p className="text-sm text-gray-500">
                                                Notificações de transações
                                                financeiras
                                            </p>
                                        </div>
                                        <Switch
                                            checked={notifications.pushPayments}
                                            onCheckedChange={(checked) =>
                                                setNotifications((prev) => ({
                                                    ...prev,
                                                    pushPayments: checked,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button>
                                <Save className="h-4 w-4 mr-2" />
                                Salvar Preferências
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Aba Privacidade */}
                <TabsContent value="privacy" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Shield className="h-5 w-5 mr-2" />
                                Configurações de Privacidade
                            </CardTitle>
                            <CardDescription>
                                Controle quem pode ver suas informações
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Visibilidade do Perfil</Label>
                                        <p className="text-sm text-gray-500">
                                            Quem pode ver seu perfil completo
                                        </p>
                                    </div>
                                    <Select
                                        value={privacy.profileVisibility}
                                        onValueChange={(value) =>
                                            setPrivacy((prev) => ({
                                                ...prev,
                                                profileVisibility: value,
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="w-48">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="public">
                                                Público
                                            </SelectItem>
                                            <SelectItem value="clients">
                                                Apenas Clientes
                                            </SelectItem>
                                            <SelectItem value="private">
                                                Privado
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Mostrar Email</Label>
                                        <p className="text-sm text-gray-500">
                                            Permitir que outros vejam seu email
                                        </p>
                                    </div>
                                    <Switch
                                        checked={privacy.showEmail}
                                        onCheckedChange={(checked) =>
                                            setPrivacy((prev) => ({
                                                ...prev,
                                                showEmail: checked,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Mostrar Telefone</Label>
                                        <p className="text-sm text-gray-500">
                                            Exibir número de telefone no perfil
                                        </p>
                                    </div>
                                    <Switch
                                        checked={privacy.showPhone}
                                        onCheckedChange={(checked) =>
                                            setPrivacy((prev) => ({
                                                ...prev,
                                                showPhone: checked,
                                            }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <Label>Mostrar Avaliações</Label>
                                        <p className="text-sm text-gray-500">
                                            Exibir avaliações e feedback no
                                            perfil
                                        </p>
                                    </div>
                                    <Switch
                                        checked={privacy.showRating}
                                        onCheckedChange={(checked) =>
                                            setPrivacy((prev) => ({
                                                ...prev,
                                                showRating: checked,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            <Button>
                                <Save className="h-4 w-4 mr-2" />
                                Salvar Configurações
                            </Button>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Aba Faturamento */}
                <TabsContent value="billing" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <CreditCard className="h-5 w-5 mr-2" />
                                Informações de Faturamento
                            </CardTitle>
                            <CardDescription>
                                Gerencie seus métodos de pagamento
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center py-8">
                                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Nenhum método de pagamento
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Adicione um cartão ou conta bancária para
                                    receber pagamentos
                                </p>
                                <Button>Adicionar Método de Pagamento</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Settings;
