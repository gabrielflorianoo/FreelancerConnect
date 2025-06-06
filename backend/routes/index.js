import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Rota principal - retorna algumas estatísticas básicas
router.get("/", async (req, res) => {
    try {
        const stats = {
            totalUsers: await prisma.user.count(),
            totalJobs: await prisma.job.count(),
            recentJobs: await prisma.job.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    title: true,
                    category: true,
                    status: true,
                    createdAt: true,
                },
            }),
            totalFreelancers: await prisma.user.count({
                where: { role: "FREELANCER" },
            }),
            totalClients: await prisma.user.count({
                where: { role: "CLIENT" },
            }),
            completedJobs: await prisma.job.count({
                where: { status: "COMPLETED" },
            }),
        };

        res.json({
            message: "Bem-vindo à API do FreelancerConnect",
            stats,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar estatísticas",
            error: error.message,
        });
    }
});

// Rota de status da API
router.get("/status", (req, res) => {
    res.json({
        status: "online",
        timestamp: new Date(),
        version: "1.0.0",
    });
});

export default router;
