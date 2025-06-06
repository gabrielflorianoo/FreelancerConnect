import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obter todas as avaliações de um freelancer
export const getFreelancerReviews = async (req, res) => {
    const { freelancerId } = req.params;

    try {
        // Verificar se o freelancer existe
        const freelancer = await prisma.user.findUnique({
            where: { id: freelancerId },
        });

        if (!freelancer) {
            return res
                .status(404)
                .json({ message: "Freelancer não encontrado" });
        }

        // Buscar as avaliações
        const reviews = await prisma.review.findMany({
            where: { freelancerId },
            include: {
                job: {
                    select: {
                        id: true,
                        title: true,
                        client: {
                            select: {
                                id: true,
                                name: true,
                                avatarUrl: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar avaliações",
            error: error.message,
        });
    }
};

// Obter uma avaliação pelo ID
export const getReviewById = async (req, res) => {
    const { id } = req.params;

    try {
        const review = await prisma.review.findUnique({
            where: { id },
            include: {
                job: {
                    select: {
                        id: true,
                        title: true,
                        client: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                freelancer: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        if (!review) {
            return res
                .status(404)
                .json({ message: "Avaliação não encontrada" });
        }

        res.json(review);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar avaliação",
            error: error.message,
        });
    }
};

// Criar uma nova avaliação
export const createReview = async (req, res) => {
    const { jobId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; // Assume que temos o ID do usuário do middleware de autenticação

    try {
        // Verificar se o job existe e está completo
        const job = await prisma.job.findUnique({
            where: { id: jobId },
        });

        if (!job) {
            return res.status(404).json({ message: "Job não encontrado" });
        }

        if (job.status !== "COMPLETED") {
            return res.status(400).json({
                message: "O job precisa estar completo para ser avaliado",
            });
        }

        // Verificar se o usuário é o cliente do job
        if (job.clientId !== userId) {
            return res.status(403).json({
                message: "Apenas o cliente pode avaliar o freelancer",
            });
        }

        // Verificar se já existe uma avaliação para este job
        const existingReview = await prisma.review.findUnique({
            where: { jobId },
        });

        if (existingReview) {
            return res
                .status(400)
                .json({ message: "Este job já foi avaliado" });
        }

        // Criar a avaliação
        const review = await prisma.review.create({
            data: {
                rating,
                comment,
                job: {
                    connect: { id: jobId },
                },
                freelancer: {
                    connect: { id: job.freelancerId },
                },
            },
            include: {
                job: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
                freelancer: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao criar avaliação",
            error: error.message,
        });
    }
};

// Atualizar uma avaliação
export const updateReview = async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id; // Assume que temos o ID do usuário do middleware de autenticação

    try {
        // Verificar se a avaliação existe
        const existingReview = await prisma.review.findUnique({
            where: { id },
            include: {
                job: true,
            },
        });

        if (!existingReview) {
            return res
                .status(404)
                .json({ message: "Avaliação não encontrada" });
        }

        // Verificar se o usuário é o cliente que criou a avaliação
        if (
            existingReview.job.clientId !== userId &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({ message: "Não autorizado" });
        }

        // Atualizar a avaliação
        const updatedReview = await prisma.review.update({
            where: { id },
            data: {
                rating,
                comment,
            },
        });

        res.json(updatedReview);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao atualizar avaliação",
            error: error.message,
        });
    }
};

// Deletar uma avaliação
export const deleteReview = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Assume que temos o ID do usuário do middleware de autenticação

    try {
        // Verificar se a avaliação existe
        const existingReview = await prisma.review.findUnique({
            where: { id },
            include: {
                job: true,
            },
        });

        if (!existingReview) {
            return res
                .status(404)
                .json({ message: "Avaliação não encontrada" });
        }

        // Verificar se o usuário é o cliente que criou a avaliação ou um administrador
        if (
            existingReview.job.clientId !== userId &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({ message: "Não autorizado" });
        }

        // Deletar a avaliação
        await prisma.review.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: "Erro ao deletar avaliação",
            error: error.message,
        });
    }
};
