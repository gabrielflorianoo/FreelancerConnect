import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obter todas as mensagens de um job
export const getJobMessages = async (req, res) => {
    const { jobId } = req.params;

    try {
        // Verificar se o job existe
        const job = await prisma.job.findUnique({
            where: { id: jobId },
        });

        if (!job) {
            return res.status(404).json({ message: "Job não encontrado" });
        }

        // Verificar se o usuário tem acesso ao job (cliente, freelancer ou admin)
        const userId = req.user.id;
        if (
            job.clientId !== userId &&
            job.freelancerId !== userId &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({ message: "Não autorizado" });
        }

        // Buscar as mensagens
        const messages = await prisma.message.findMany({
            where: { jobId },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        res.json(messages);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar mensagens",
            error: error.message,
        });
    }
};

// Enviar uma nova mensagem
export const sendMessage = async (req, res) => {
    const { jobId } = req.params;
    const { content } = req.body;
    const senderId = req.user.id;

    try {
        // Verificar se o job existe
        const job = await prisma.job.findUnique({
            where: { id: jobId },
        });

        if (!job) {
            return res.status(404).json({ message: "Job não encontrado" });
        }

        // Verificar se o usuário tem acesso ao job (cliente, freelancer ou admin)
        if (
            job.clientId !== senderId &&
            job.freelancerId !== senderId &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({ message: "Não autorizado" });
        }

        // Criar a mensagem
        const message = await prisma.message.create({
            data: {
                content,
                sender: {
                    connect: { id: senderId },
                },
                job: {
                    connect: { id: jobId },
                },
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao enviar mensagem",
            error: error.message,
        });
    }
};

// Deletar uma mensagem
export const deleteMessage = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Verificar se a mensagem existe
        const message = await prisma.message.findUnique({
            where: { id },
            include: {
                job: true,
            },
        });

        if (!message) {
            return res.status(404).json({ message: "Mensagem não encontrada" });
        }

        // Verificar se o usuário é o remetente ou o administrador
        if (message.senderId !== userId && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Não autorizado" });
        }

        // Deletar a mensagem
        await prisma.message.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: "Erro ao deletar mensagem",
            error: error.message,
        });
    }
};
