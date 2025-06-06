import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Obter todos os pagamentos (admin)
export const getAllPayments = async (req, res) => {
    // Verificar se o usuário é admin (middleware)
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({
            message: "Apenas administradores podem acessar este recurso",
        });
    }

    try {
        const payments = await prisma.payment.findMany({
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
                        freelancer: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json(payments);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar pagamentos",
            error: error.message,
        });
    }
};

// Obter um pagamento pelo ID
export const getPaymentById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const payment = await prisma.payment.findUnique({
            where: { id },
            include: {
                job: {
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
                },
            },
        });

        if (!payment) {
            return res
                .status(404)
                .json({ message: "Pagamento não encontrado" });
        }

        // Verificar se o usuário tem acesso ao pagamento (cliente, freelancer ou admin)
        if (
            payment.job.clientId !== userId &&
            payment.job.freelancerId !== userId &&
            req.user.role !== "ADMIN"
        ) {
            return res.status(403).json({ message: "Não autorizado" });
        }

        res.json(payment);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar pagamento",
            error: error.message,
        });
    }
};

// Obter pagamentos do usuário (cliente ou freelancer)
export const getUserPayments = async (req, res) => {
    const userId = req.user.id;
    const { role } = req.user;

    try {
        let payments = [];

        if (role === "CLIENT") {
            // Buscar pagamentos onde o usuário é o cliente
            payments = await prisma.payment.findMany({
                where: {
                    job: {
                        clientId: userId,
                    },
                },
                include: {
                    job: {
                        select: {
                            id: true,
                            title: true,
                            freelancer: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else if (role === "FREELANCER") {
            // Buscar pagamentos onde o usuário é o freelancer
            payments = await prisma.payment.findMany({
                where: {
                    job: {
                        freelancerId: userId,
                    },
                },
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
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        } else if (role === "ADMIN") {
            // Para administradores, retornar todos os pagamentos
            payments = await prisma.payment.findMany({
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
                            freelancer: {
                                select: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
        }

        res.json(payments);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar pagamentos",
            error: error.message,
        });
    }
};

// Processar um pagamento (simulação)
export const processPayment = async (req, res) => {
    const { jobId } = req.params;
    const userId = req.user.id;

    try {
        // Verificar se o job existe
        const job = await prisma.job.findUnique({
            where: { id: jobId },
        });

        if (!job) {
            return res.status(404).json({ message: "Job não encontrado" });
        }

        // Verificar se o usuário é o cliente do job
        if (job.clientId !== userId && req.user.role !== "ADMIN") {
            return res.status(403).json({
                message: "Apenas o cliente pode processar o pagamento",
            });
        }

        // Verificar se o job está concluído
        if (job.status !== "COMPLETED") {
            return res.status(400).json({
                message:
                    "O job precisa estar concluído para processar o pagamento",
            });
        }

        // Verificar se já existe um pagamento para este job
        const existingPayment = await prisma.payment.findUnique({
            where: { jobId },
        });

        if (existingPayment) {
            return res.status(400).json({ message: "Este job já foi pago" });
        }

        // Criar o pagamento
        const payment = await prisma.payment.create({
            data: {
                jobId,
                amount: job.price,
                status: "COMPLETED",
                method: "simulado",
            },
            include: {
                job: {
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
                },
            },
        });

        // Atualizar o saldo do freelancer
        await prisma.user.update({
            where: { id: job.freelancerId },
            data: {
                balance: {
                    increment: job.price,
                },
            },
        });

        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao processar pagamento",
            error: error.message,
        });
    }
};

// Sacar saldo (freelancer)
export const withdrawBalance = async (req, res) => {
    const userId = req.user.id;
    const { amount } = req.body;

    try {
        // Verificar se o usuário é um freelancer
        if (req.user.role !== "FREELANCER") {
            return res
                .status(403)
                .json({ message: "Apenas freelancers podem sacar saldo" });
        }

        // Buscar o saldo do usuário
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { balance: true },
        });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        // Verificar se o saldo é suficiente
        if (user.balance < amount) {
            return res.status(400).json({ message: "Saldo insuficiente" });
        }

        // Atualizar o saldo do usuário
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                balance: {
                    decrement: parseFloat(amount),
                },
            },
            select: {
                id: true,
                name: true,
                balance: true,
            },
        });

        // Em um sistema real, aqui seria feita a integração com um gateway de pagamento
        // para transferir o valor para a conta bancária do freelancer

        res.json({
            message: "Saque processado com sucesso",
            newBalance: updatedUser.balance,
            withdrawAmount: parseFloat(amount),
        });
    } catch (error) {
        res.status(500).json({
            message: "Erro ao processar saque",
            error: error.message,
        });
    }
};
