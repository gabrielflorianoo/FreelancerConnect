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
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Textarea } from "../../components/ui/textarea";
import {
    Search,
    Send,
    Paperclip,
    MoreVertical,
    Phone,
    Video,
} from "lucide-react";

const Messages = () => {
    const [selectedChat, setSelectedChat] = useState(1);
    const [newMessage, setNewMessage] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    const conversations = [
        {
            id: 1,
            participant: {
                name: "Ana Silva",
                avatar: "",
                status: "online",
            },
            lastMessage:
                "Olá! Acabei de enviar a primeira versão do protótipo. Você pode dar uma olhada?",
            timestamp: "10:30",
            unread: 2,
            project: "Desenvolvimento de App Mobile",
        },
        {
            id: 2,
            participant: {
                name: "Carlos Santos",
                avatar: "",
                status: "offline",
            },
            lastMessage:
                "Perfeito! Vou implementar as alterações que você sugeriu.",
            timestamp: "Ontem",
            unread: 0,
            project: "Design de Logo",
        },
        {
            id: 3,
            participant: {
                name: "Marina Costa",
                avatar: "",
                status: "online",
            },
            lastMessage:
                "Quando podemos agendar uma reunião para discutir a estratégia?",
            timestamp: "2 dias",
            unread: 1,
            project: "Marketing Digital",
        },
    ];

    const messages = [
        {
            id: 1,
            sender: "Ana Silva",
            content: "Olá! Como está o projeto?",
            timestamp: "09:00",
            isOwn: false,
        },
        {
            id: 2,
            sender: "Você",
            content:
                "Oi Ana! Está indo bem. Estou ansioso para ver os primeiros resultados.",
            timestamp: "09:15",
            isOwn: true,
        },
        {
            id: 3,
            sender: "Ana Silva",
            content:
                "Ótimo! Acabei de enviar a primeira versão do protótipo. Você pode dar uma olhada?",
            timestamp: "10:30",
            isOwn: false,
        },
        {
            id: 4,
            sender: "Ana Silva",
            content: "Qualquer dúvida, me avise!",
            timestamp: "10:31",
            isOwn: false,
        },
    ];

    const filteredConversations = conversations.filter(
        (conv) =>
            conv.participant.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            conv.project.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            console.log("Enviando mensagem:", newMessage);
            setNewMessage("");
        }
    };

    return (
        <div className="p-6 h-[calc(100vh-120px)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
                {/* Lista de Conversas */}
                <div className="lg:col-span-4">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Mensagens</CardTitle>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Buscar conversas..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="pl-10"
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="space-y-1 max-h-96 overflow-y-auto">
                                {filteredConversations.map((conversation) => (
                                    <div
                                        key={conversation.id}
                                        className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                                            selectedChat === conversation.id
                                                ? "bg-primary-50 border-r-2 border-primary-500"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            setSelectedChat(conversation.id)
                                        }
                                    >
                                        <div className="relative mr-3">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage
                                                    src={
                                                        conversation.participant
                                                            .avatar
                                                    }
                                                />
                                                <AvatarFallback>
                                                    {conversation.participant.name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")}
                                                </AvatarFallback>
                                            </Avatar>
                                            {conversation.participant.status ===
                                                "online" && (
                                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-medium text-gray-900 truncate">
                                                    {
                                                        conversation.participant
                                                            .name
                                                    }
                                                </h3>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-xs text-gray-500">
                                                        {conversation.timestamp}
                                                    </span>
                                                    {conversation.unread >
                                                        0 && (
                                                        <Badge className="bg-primary-500 text-white text-xs px-2 py-1">
                                                            {
                                                                conversation.unread
                                                            }
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">
                                                {conversation.project}
                                            </p>
                                            <p className="text-sm text-gray-500 truncate mt-1">
                                                {conversation.lastMessage}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Chat Ativo */}
                <div className="lg:col-span-8">
                    <Card className="h-full flex flex-col">
                        {/* Header do Chat */}
                        <CardHeader className="border-b">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarFallback>AS</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-medium">
                                            Ana Silva
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Desenvolvimento de App Mobile
                                        </p>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <Button variant="outline" size="icon">
                                        <Phone className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <Video className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>

                        {/* Mensagens */}
                        <CardContent className="flex-1 p-4 overflow-y-auto">
                            <div className="space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                message.isOwn
                                                    ? "bg-primary-500 text-white"
                                                    : "bg-gray-100 text-gray-900"
                                            }`}
                                        >
                                            <p className="text-sm">
                                                {message.content}
                                            </p>
                                            <p
                                                className={`text-xs mt-1 ${
                                                    message.isOwn
                                                        ? "text-primary-100"
                                                        : "text-gray-500"
                                                }`}
                                            >
                                                {message.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>

                        {/* Input de Nova Mensagem */}
                        <div className="border-t p-4">
                            <div className="flex space-x-2">
                                <Button variant="outline" size="icon">
                                    <Paperclip className="h-4 w-4" />
                                </Button>
                                <div className="flex-1">
                                    <Textarea
                                        placeholder="Digite sua mensagem..."
                                        value={newMessage}
                                        onChange={(e) =>
                                            setNewMessage(e.target.value)
                                        }
                                        className="min-h-[40px] resize-none"
                                        onKeyPress={(e) => {
                                            if (
                                                e.key === "Enter" &&
                                                !e.shiftKey
                                            ) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                </div>
                                <Button onClick={handleSendMessage}>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Messages;
