import { userAPI } from "@/server/api";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";
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
import { User } from "lucide-react";
import { User as UserType } from "@/types";

const ProfileDetails: React.FC = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState<UserType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            const fetchProfile = async () => {
                try {
                    const response = await userAPI.getUserById(userId);

                    const data: UserType = await response.data.user;

                    console.log("Perfil carregado:", data);

                    setProfile(data);
                } catch (error) {
                    console.error("Erro ao carregar perfil:", error);
                } finally {
                    setLoading(false);
                }
            };

            fetchProfile();
        }
    }, [userId]);

    if (loading) return <div>Carregando perfil...</div>;
    if (!profile) return <div>Perfil não encontrado.</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Perfil de {profile.name}
                    {profile.role === "FREELANCER" && (
                        <span className="ml-2 text-sm text-gray-500">
                            Freelancer
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center space-x-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={profile.avatarUrl} />
                        <AvatarFallback className="text-lg">
                            {profile.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Formulário */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nome Completo</Label>
                        <Input id="name" value={profile.name} readOnly />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={profile.email}
                            readOnly
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" value={profile.phone} readOnly />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Localização</Label>
                        <Input
                            id="location"
                            value={profile.location}
                            readOnly
                        />
                    </div>

                    {profile?.role === "FREELANCER" &&
                        (() => {
                            const freelancer =
                                profile as import("@/types").FreelancerProfile;
                            return (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="hourlyRate">
                                            Valor por Hora (R$)
                                        </Label>
                                        <Input
                                            id="hourlyRate"
                                            type="number"
                                            value={freelancer.hourlyRate || ""}
                                            readOnly
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="availability">
                                            Disponibilidade
                                        </Label>
                                        <Select
                                            value={freelancer.availability}
                                            disabled
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

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            value={freelancer.website}
                                            readOnly
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="bio">Biografia</Label>
                                        <Textarea
                                            id="bio"
                                            className="min-h-32"
                                            value={profile.bio}
                                            readOnly
                                        />
                                    </div>
                                </>
                            );
                        })()}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfileDetails;
