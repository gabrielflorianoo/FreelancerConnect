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
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../../components/ui/avatar";
import { Textarea } from "../../components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { Star, Filter, ThumbsUp, MessageSquare } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const Reviews = () => {
    const { user } = useAuthStore();
    const [filterRating, setFilterRating] = useState("all");
    const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

    const reviews = [
        {
            id: 1,
            project: "Desenvolvimento de App Mobile",
            reviewer: user?.userType === "client" ? "Ana Silva" : "João Silva",
            reviewerAvatar: "",
            rating: 5,
            comment:
                "Excelente trabalho! Muito profissional e entregou tudo no prazo combinado.",
            date: "2023-12-15",
            helpful: 12,
            projectValue: 5000,
            isClient: user?.userType === "client",
        },
        {
            id: 2,
            project: "Design de Logo",
            reviewer:
                user?.userType === "client" ? "Carlos Santos" : "Maria Costa",
            reviewerAvatar: "",
            rating: 4,
            comment:
                "Ótimo designer, criativo e atencioso aos detalhes. Recomendo!",
            date: "2023-12-10",
            helpful: 8,
            projectValue: 800,
            isClient: user?.userType === "client",
        },
        {
            id: 3,
            project: "Gestão de Redes Sociais",
            reviewer:
                user?.userType === "client" ? "Marina Costa" : "Pedro Santos",
            reviewerAvatar: "",
            rating: 5,
            comment:
                "Superou minhas expectativas! Muito conhecimento em marketing digital.",
            date: "2023-12-05",
            helpful: 15,
            projectValue: 1200,
            isClient: user?.userType === "client",
        },
    ];

    const avgRating =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;
    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: reviews.filter((r) => r.rating === rating).length,
        percentage:
            (reviews.filter((r) => r.rating === rating).length /
                reviews.length) *
            100,
    }));

    const filteredReviews =
        filterRating === "all"
            ? reviews
            : reviews.filter((r) => r.rating === parseInt(filterRating));

    const renderStars = (rating: number, size = "h-4 w-4") => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${size} ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    {user?.userType === "client"
                        ? "Avaliações Recebidas"
                        : "Minhas Avaliações"}
                </h1>
                <p className="text-gray-600">
                    {user?.userType === "client"
                        ? "Veja como os freelancers avaliam você"
                        : "Feedback dos seus clientes"}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Resumo das Avaliações */}
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Resumo</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-gray-900">
                                    {avgRating.toFixed(1)}
                                </div>
                                <div className="flex justify-center mt-1">
                                    {renderStars(
                                        Math.round(avgRating),
                                        "h-5 w-5",
                                    )}
                                </div>
                                <p className="text-sm text-gray-500 mt-1">
                                    {reviews.length} avaliações
                                </p>
                            </div>

                            <div className="space-y-2">
                                {ratingDistribution.map(
                                    ({ rating, count, percentage }) => (
                                        <div
                                            key={rating}
                                            className="flex items-center space-x-2"
                                        >
                                            <span className="text-sm w-8">
                                                {rating}
                                            </span>
                                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-yellow-400 rounded-full"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>
                                            <span className="text-sm text-gray-500 w-8">
                                                {count}
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Lista de Avaliações */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">
                            Todas as Avaliações
                        </h2>
                        <Select
                            value={filterRating}
                            onValueChange={setFilterRating}
                        >
                            <SelectTrigger className="w-48">
                                <SelectValue placeholder="Filtrar por estrelas" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Todas as estrelas
                                </SelectItem>
                                <SelectItem value="5">5 estrelas</SelectItem>
                                <SelectItem value="4">4 estrelas</SelectItem>
                                <SelectItem value="3">3 estrelas</SelectItem>
                                <SelectItem value="2">2 estrelas</SelectItem>
                                <SelectItem value="1">1 estrela</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        {filteredReviews.map((review) => (
                            <Card key={review.id}>
                                <CardContent className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <Avatar className="h-10 w-10 flex-shrink-0">
                                            <AvatarImage
                                                src={review.reviewerAvatar}
                                            />
                                            <AvatarFallback>
                                                {review.reviewer
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">
                                                        {review.reviewer}
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {review.project}
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-2 mt-1 md:mt-0">
                                                    {renderStars(review.rating)}
                                                    <span className="text-sm text-gray-500">
                                                        {new Date(
                                                            review.date,
                                                        ).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            <p className="text-gray-700 mt-3">
                                                {review.comment}
                                            </p>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                    <span>
                                                        Projeto: R${" "}
                                                        {review.projectValue.toLocaleString()}
                                                    </span>
                                                    <Badge variant="outline">
                                                        {review.isClient
                                                            ? "Avaliação de Freelancer"
                                                            : "Avaliação de Cliente"}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <ThumbsUp className="h-4 w-4 mr-1" />
                                                        Útil ({review.helpful})
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <MessageSquare className="h-4 w-4 mr-1" />
                                                        Responder
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {filteredReviews.length === 0 && (
                        <Card>
                            <CardContent className="text-center py-8">
                                <p className="text-gray-500">
                                    Nenhuma avaliação encontrada para este
                                    filtro.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reviews;
