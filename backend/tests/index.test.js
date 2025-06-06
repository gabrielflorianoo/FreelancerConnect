import request from "supertest";
import { jest } from "@jest/globals";
import app from "../app.js";
import {
    prisma,
    setupDatabase,
    createTestUser,
    generateAuthToken,
    closeDatabase,
} from "./setupTests.js";

describe("Testes da API Principal", () => {
    let clientUser;
    let freelancerUser;
    let testJob;

    // Configurar banco de dados antes de cada teste
    beforeEach(async () => {
        await setupDatabase();

        // Criar usuários de teste
        clientUser = await createTestUser({
            email: "cliente@example.com",
            role: "CLIENT",
        });

        freelancerUser = await createTestUser({
            email: "freelancer@example.com",
            role: "FREELANCER",
        });

        // Criar alguns jobs de teste
        testJob = await prisma.job.create({
            data: {
                title: "Job de Teste 1",
                description: "Descrição do job de teste 1",
                category: "Desenvolvimento",
                location: "Remoto",
                price: 1000,
                status: "PENDING",
                client: {
                    connect: { id: clientUser.id },
                },
            },
        });

        await prisma.job.create({
            data: {
                title: "Job de Teste 2",
                description: "Descrição do job de teste 2",
                category: "Design",
                location: "São Paulo",
                price: 800,
                status: "ACCEPTED",
                client: {
                    connect: { id: clientUser.id },
                },
                freelancer: {
                    connect: { id: freelancerUser.id },
                },
            },
        });

        await prisma.job.create({
            data: {
                title: "Job de Teste 3",
                description: "Descrição do job de teste 3",
                category: "Marketing",
                location: "Remoto",
                price: 1200,
                status: "COMPLETED",
                client: {
                    connect: { id: clientUser.id },
                },
                freelancer: {
                    connect: { id: freelancerUser.id },
                },
            },
        });
    });

    // Fechar conexão com banco de dados após todos os testes
    afterAll(async () => {
        await closeDatabase();
    });

    // Testes da rota principal
    describe("GET /api", () => {
        it("deve retornar estatísticas básicas do sistema", async () => {
            const response = await request(app).get("/api");

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty(
                "message",
                "Bem-vindo à API do FreelancerConnect",
            );
            expect(response.body).toHaveProperty("stats");

            // Verificar estatísticas
            expect(response.body.stats).toHaveProperty("totalUsers", 2); // clientUser e freelancerUser
            expect(response.body.stats).toHaveProperty("totalJobs", 3); // Os três jobs criados
            expect(response.body.stats).toHaveProperty("totalFreelancers", 1); // freelancerUser
            expect(response.body.stats).toHaveProperty("totalClients", 1); // clientUser
            expect(response.body.stats).toHaveProperty("completedJobs", 1); // Um job completado

            // Verificar jobs recentes
            expect(response.body.stats).toHaveProperty("recentJobs");
            expect(Array.isArray(response.body.stats.recentJobs)).toBe(true);
            expect(response.body.stats.recentJobs.length).toBeGreaterThan(0);
        });
    });

    // Testes da rota de status
    describe("GET /api/status", () => {
        it("deve retornar o status da API", async () => {
            const response = await request(app).get("/api/status");

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("status", "online");
            expect(response.body).toHaveProperty("timestamp");
            expect(response.body).toHaveProperty("version");
        });
    });
});
