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

describe("Testes da API de Pagamentos", () => {
    let clientUser;
    let freelancerUser;
    let adminUser;
    let clientToken;
    let freelancerToken;
    let adminToken;
    let testJob;
    let testPayment;

    // Configurar banco de dados antes de cada teste
    beforeEach(async () => {
        await setupDatabase();

        // Criar usuários de teste
        clientUser = await createTestUser({
            email: "cliente@example.com",
            role: "CLIENT",
            balance: 1000,
        });
        clientToken = generateAuthToken(clientUser.id, "CLIENT");

        freelancerUser = await createTestUser({
            email: "freelancer@example.com",
            role: "FREELANCER",
            balance: 500,
        });
        freelancerToken = generateAuthToken(freelancerUser.id, "FREELANCER");

        adminUser = await createTestUser({
            email: "admin@example.com",
            role: "ADMIN",
        });
        adminToken = generateAuthToken(adminUser.id, "ADMIN");

        // Criar um job completado de teste
        testJob = await prisma.job.create({
            data: {
                title: "Job de Teste",
                description: "Descrição do job de teste",
                category: "Desenvolvimento",
                location: "Remoto",
                price: 1000,
                status: "COMPLETED",
                client: {
                    connect: { id: clientUser.id },
                },
                freelancer: {
                    connect: { id: freelancerUser.id },
                },
            },
        });

        // Criar um pagamento de teste
        testPayment = await prisma.payment.create({
            data: {
                jobId: testJob.id,
                amount: 1000,
                status: "COMPLETED",
                method: "simulado",
            },
        });
    });

    // Fechar conexão com banco de dados após todos os testes
    afterAll(async () => {
        await closeDatabase();
    });

    // Testes de listagem de pagamentos (admin)
    describe("GET /api/payments", () => {
        it("deve permitir que admin veja todos os pagamentos", async () => {
            const response = await request(app)
                .get("/api/payments")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toHaveProperty("id", testPayment.id);
            expect(response.body[0]).toHaveProperty("amount", 1000);
        });

        it("deve impedir que usuários não-admin vejam todos os pagamentos", async () => {
            const response = await request(app)
                .get("/api/payments")
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(403);
        });
    });

    // Testes de obtenção de pagamento específico
    describe("GET /api/payments/:id", () => {
        it("deve permitir que o cliente veja o pagamento do seu job", async () => {
            const response = await request(app)
                .get(`/api/payments/${testPayment.id}`)
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id", testPayment.id);
            expect(response.body).toHaveProperty("amount", 1000);
        });

        it("deve permitir que o freelancer veja o pagamento do seu job", async () => {
            const response = await request(app)
                .get(`/api/payments/${testPayment.id}`)
                .set("Authorization", `Bearer ${freelancerToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id", testPayment.id);
            expect(response.body).toHaveProperty("amount", 1000);
        });

        it("deve impedir que outros usuários vejam o pagamento", async () => {
            // Criar outro usuário
            const otherUser = await createTestUser({
                email: "outro@example.com",
            });
            const otherToken = generateAuthToken(otherUser.id);

            const response = await request(app)
                .get(`/api/payments/${testPayment.id}`)
                .set("Authorization", `Bearer ${otherToken}`);

            expect(response.status).toBe(403);
        });

        it("deve retornar 404 para pagamento inexistente", async () => {
            const response = await request(app)
                .get("/api/payments/id-inexistente")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(404);
        });
    });

    // Testes de pagamentos do usuário
    describe("GET /api/payments/user", () => {
        it("deve retornar pagamentos do cliente", async () => {
            const response = await request(app)
                .get("/api/payments/user")
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toHaveProperty("job");
            expect(response.body[0].job).toHaveProperty("freelancer");
        });

        it("deve retornar pagamentos do freelancer", async () => {
            const response = await request(app)
                .get("/api/payments/user")
                .set("Authorization", `Bearer ${freelancerToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toHaveProperty("job");
            expect(response.body[0].job).toHaveProperty("client");
        });
    });

    // Testes de processamento de pagamento
    describe("POST /api/payments/job/:jobId", () => {
        it("deve impedir pagamento para job já pago", async () => {
            const response = await request(app)
                .post(`/api/payments/job/${testJob.id}`)
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty(
                "message",
                "Este job já foi pago",
            );
        });

        it("deve processar pagamento para job completado", async () => {
            // Criar novo job completado sem pagamento
            const newJob = await prisma.job.create({
                data: {
                    title: "Novo Job",
                    description: "Descrição do novo job",
                    category: "Design",
                    location: "Remoto",
                    price: 500,
                    status: "COMPLETED",
                    client: {
                        connect: { id: clientUser.id },
                    },
                    freelancer: {
                        connect: { id: freelancerUser.id },
                    },
                },
            });

            const response = await request(app)
                .post(`/api/payments/job/${newJob.id}`)
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("jobId", newJob.id);
            expect(response.body).toHaveProperty("amount", 500);
            expect(response.body).toHaveProperty("status", "COMPLETED");

            // Verificar se o saldo do freelancer foi atualizado
            const updatedFreelancer = await prisma.user.findUnique({
                where: { id: freelancerUser.id },
                select: { balance: true },
            });
            expect(updatedFreelancer.balance).toBe(1000); // 500 inicial + 500 do pagamento
        });

        it("deve impedir que o freelancer processe o pagamento", async () => {
            // Criar novo job completado sem pagamento
            const newJob = await prisma.job.create({
                data: {
                    title: "Outro Job",
                    description: "Descrição do outro job",
                    category: "Marketing",
                    location: "Remoto",
                    price: 300,
                    status: "COMPLETED",
                    client: {
                        connect: { id: clientUser.id },
                    },
                    freelancer: {
                        connect: { id: freelancerUser.id },
                    },
                },
            });

            const response = await request(app)
                .post(`/api/payments/job/${newJob.id}`)
                .set("Authorization", `Bearer ${freelancerToken}`);

            expect(response.status).toBe(403);
        });
    });

    // Testes de saque de saldo
    describe("POST /api/payments/withdraw", () => {
        it("deve permitir que freelancer saque saldo", async () => {
            const response = await request(app)
                .post("/api/payments/withdraw")
                .set("Authorization", `Bearer ${freelancerToken}`)
                .send({ amount: 200 });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty(
                "message",
                "Saque processado com sucesso",
            );
            expect(response.body).toHaveProperty("newBalance", 300); // 500 inicial - 200 de saque
            expect(response.body).toHaveProperty("withdrawAmount", 200);
        });

        it("deve impedir saque com saldo insuficiente", async () => {
            const response = await request(app)
                .post("/api/payments/withdraw")
                .set("Authorization", `Bearer ${freelancerToken}`)
                .send({ amount: 1000 }); // Maior que o saldo de 500

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty(
                "message",
                "Saldo insuficiente",
            );
        });

        it("deve impedir que cliente faça saque", async () => {
            const response = await request(app)
                .post("/api/payments/withdraw")
                .set("Authorization", `Bearer ${clientToken}`)
                .send({ amount: 100 });

            expect(response.status).toBe(403);
            expect(response.body).toHaveProperty(
                "message",
                "Apenas freelancers podem sacar saldo",
            );
        });
    });
});
