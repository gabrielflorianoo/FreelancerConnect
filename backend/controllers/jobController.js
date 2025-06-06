import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obter todos os jobs
export const getAllJobs = async (req, res) => {
    const { status, category } = req.query;

    try {
        // Construir o filtro baseado na query
        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (category) {
            filter.category = category;
        }

        const jobs = await prisma.job.findMany({
            where: filter,
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
                freelancer: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json(jobs);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar jobs",
            error: error.message,
        });
    }
};

// Obter um job pelo ID
export const getJobById = async (req, res) => {
    const { id } = req.params;

    try {
        const job = await prisma.job.findUnique({
            where: { id },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
                freelancer: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
                messages: {
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
                },
                review: true,
                payment: true,
            },
        });

        if (!job) {
            return res.status(404).json({ message: "Job não encontrado" });
        }

        res.json(job);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar job",
            error: error.message,
        });
    }
};

// Criar um novo job
export const createJob = async (req, res) => {
    const { title, description, category, location, price } = req.body;
    const clientId = req.user.id; // Assume que temos o ID do usuário do middleware de autenticação

    try {
        const newJob = await prisma.job.create({
            data: {
                title,
                description,
                category,
                location,
                price: parseFloat(price),
                client: {
                    connect: { id: clientId },
                },
            },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true,
                    },
                },
            },
        });

        res.status(201).json(newJob);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao criar job",
            error: error.message,
        });
    }
};

// Atualizar um job
export const updateJob = async (req, res) => {
    const { id } = req.params;
    const { title, description, category, location, price } = req.body;
    const userId = req.user.id; // Assume que temos o ID do usuário do middleware de autenticação

    try {
        // Verificar se o job existe
        const existingJob = await prisma.job.findUnique({
            where: { id },
            include: { client: true },
        });

        if (!existingJob) {
            return res.status(404).json({ message: "Job não encontrado" });
        }

        // Verificar se o usuário é o dono do job
        if (existingJob.clientId !== userId && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Não autorizado" });
        }

        // Atualizar o job
        const updatedJob = await prisma.job.update({
            where: { id },
            data: {
                title,
                description,
                category,
                location,
                price: parseFloat(price),
            },
        });

        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao atualizar job",
            error: error.message,
        });
    }
};

// Deletar um job
export const deleteJob = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Assume que temos o ID do usuário do middleware de autenticação

    try {
        // Verificar se o job existe
        const existingJob = await prisma.job.findUnique({
            where: { id },
            include: { client: true },
        });

        if (!existingJob) {
            return res.status(404).json({ message: "Job não encontrado" });
        }

        // Verificar se o usuário é o dono do job
        if (existingJob.clientId !== userId && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Não autorizado" });
        }

        // Deletar o job
        await prisma.job.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: "Erro ao deletar job",
            error: error.message,
        });
    }
};

// Aceitar um job (freelancer)
export const acceptJob = async (req, res) => {
    const { id } = req.params;
    const freelancerId = req.user.id; // Assume que temos o ID do usuário do middleware de autenticação

    try {
        // Verificar se o job existe e está pendente
        const existingJob = await prisma.job.findUnique({
            where: { id },
        });

        if (!existingJob) {
            return res.status(404).json({ message: "Job não encontrado" });
        }

        if (existingJob.status !== "PENDING") {
            return res
                .status(400)
                .json({ message: "Este job já foi aceito ou finalizado" });
        }

        // Verificar se o usuário é um freelancer
        if (req.user.role !== "FREELANCER") {
            return res
                .status(403)
                .json({ message: "Apenas freelancers podem aceitar jobs" });
        }

        // Atualizar o job
        const updatedJob = await prisma.job.update({
            where: { id },
            data: {
                status: "ACCEPTED",
                freelancer: {
                    connect: { id: freelancerId },
                },
            },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                freelancer: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao aceitar job",
            error: error.message,
        });
    }
};

// Marcar job como completo
export const completeJob = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Assume que temos o ID do usuário do middleware de autenticação

    try {
        // Verificar se o job existe e foi aceito
        const existingJob = await prisma.job.findUnique({
            where: { id },
            include: {
                client: true,
                freelancer: true,
            },
        });

        if (!existingJob) {
            return res.status(404).json({ message: "Job não encontrado" });
        }

        if (existingJob.status !== "ACCEPTED") {
            return res.status(400).json({
                message:
                    "Este job precisa estar em andamento para ser finalizado",
            });
        }

        // Verificar se o usuário é o cliente ou o administrador
        if (existingJob.clientId !== userId && req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Não autorizado" });
        }

        // Atualizar o job
        const updatedJob = await prisma.job.update({
            where: { id },
            data: {
                status: "COMPLETED",
            },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
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

        // Criar o pagamento
        await prisma.payment.create({
            data: {
                jobId: id,
                amount: existingJob.price,
                status: "COMPLETED",
                method: "simulado",
            },
        });

        // Atualizar o saldo do freelancer
        await prisma.user.update({
            where: { id: existingJob.freelancerId },
            data: {
                balance: {
                    increment: existingJob.price,
                },
            },
        });

        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao completar job",
            error: error.message,
        });
    }
};

// Cancelar um job
export const cancelJob = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Assume que temos o ID do usuário do middleware de autenticação

    try {
        // Verificar se o job existe
        const existingJob = await prisma.job.findUnique({
            where: { id },
            include: {
                client: true,
                freelancer: true,
            },
        });

        if (!existingJob) {
            return res.status(404).json({ message: "Job não encontrado" });
        }

        // Verificar se o usuário é o cliente, freelancer (se aceito) ou admin
        if (
            existingJob.clientId !== userId &&
            existingJob.freelancerId !== userId &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({ message: "Não autorizado" });
        }

        // Verificar se o job pode ser cancelado (não pode estar completo)
        if (existingJob.status === "COMPLETED") {
            return res
                .status(400)
                .json({ message: "Jobs completos não podem ser cancelados" });
        }

        // Atualizar o job
        const updatedJob = await prisma.job.update({
            where: { id },
            data: {
                status: "CANCELLED",
            },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
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

        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao cancelar job",
            error: error.message,
        });
    }
};
