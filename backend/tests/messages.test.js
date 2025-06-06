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

describe("Testes da API de Mensagens", () => {
    let clientUser;
    let freelancerUser;
    let clientToken;
    let freelancerToken;
    let testJob;
    let testMessage;

    // Configurar banco de dados antes de cada teste
    beforeEach(async () => {
        await setupDatabase();

        // Criar usuário cliente de teste
        clientUser = await createTestUser({
            email: "cliente@example.com",
            role: "CLIENT",
        });
        clientToken = generateAuthToken(clientUser.id, "CLIENT");

        // Criar usuário freelancer de teste
        freelancerUser = await createTestUser({
            email: "freelancer@example.com",
            role: "FREELANCER",
        });
        freelancerToken = generateAuthToken(freelancerUser.id, "FREELANCER");

        // Criar um job de teste
        testJob = await prisma.job.create({
            data: {
                title: "Job de Teste",
                description: "Descrição do job de teste",
                category: "Desenvolvimento",
                location: "Remoto",
                price: 1000,
                status: "PENDING",
                client: {
                    connect: { id: clientUser.id },
                },
                freelancer: {
                    connect: { id: freelancerUser.id },
                },
            },
        });

        // Criar uma mensagem de teste
        testMessage = await prisma.message.create({
            data: {
                content: "Mensagem de teste",
                sender: {
                    connect: { id: clientUser.id },
                },
                job: {
                    connect: { id: testJob.id },
                },
            },
        });
    });

    // Fechar conexão com banco de dados após todos os testes
    afterAll(async () => {
        await closeDatabase();
    });

    // Testes de obtenção de mensagens de um job
    describe("GET /api/messages/job/:jobId", () => {
        it("deve retornar mensagens de um job para participantes", async () => {
            const response = await request(app)
                .get(`/api/messages/job/${testJob.id}`)
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toHaveProperty(
                "content",
                "Mensagem de teste",
            );
            expect(response.body[0]).toHaveProperty("sender");
            expect(response.body[0].sender).toHaveProperty("id", clientUser.id);
        });

        it("deve impedir acesso às mensagens para usuários não participantes", async () => {
            // Criar outro usuário não relacionado ao job
            const otherUser = await createTestUser({
                email: "outro@example.com",
            });
            const otherToken = generateAuthToken(otherUser.id);

            const response = await request(app)
                .get(`/api/messages/job/${testJob.id}`)
                .set("Authorization", `Bearer ${otherToken}`);

            expect(response.status).toBe(403);
        });

        it("deve retornar 404 para job inexistente", async () => {
            const response = await request(app)
                .get("/api/messages/job/id-inexistente")
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(404);
        });
    });

    // Testes de envio de mensagem
    describe("POST /api/messages/job/:jobId", () => {
        it("deve permitir que o cliente envie mensagem", async () => {
            const response = await request(app)
                .post(`/api/messages/job/${testJob.id}`)
                .set("Authorization", `Bearer ${clientToken}`)
                .send({ content: "Nova mensagem do cliente" });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty(
                "content",
                "Nova mensagem do cliente",
            );
            expect(response.body).toHaveProperty("sender");
            expect(response.body.sender).toHaveProperty("id", clientUser.id);
        });

        it("deve permitir que o freelancer envie mensagem", async () => {
            const response = await request(app)
                .post(`/api/messages/job/${testJob.id}`)
                .set("Authorization", `Bearer ${freelancerToken}`)
                .send({ content: "Nova mensagem do freelancer" });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty(
                "content",
                "Nova mensagem do freelancer",
            );
            expect(response.body).toHaveProperty("sender");
            expect(response.body.sender).toHaveProperty(
                "id",
                freelancerUser.id,
            );
        });

        it("deve impedir que usuários não participantes enviem mensagem", async () => {
            // Criar outro usuário não relacionado ao job
            const otherUser = await createTestUser({
                email: "outro@example.com",
            });
            const otherToken = generateAuthToken(otherUser.id);

            const response = await request(app)
                .post(`/api/messages/job/${testJob.id}`)
                .set("Authorization", `Bearer ${otherToken}`)
                .send({ content: "Tentativa de mensagem não autorizada" });

            expect(response.status).toBe(403);
        });
    });

    // Testes de deleção de mensagem
    describe("DELETE /api/messages/:id", () => {
        it("deve permitir que o remetente delete sua mensagem", async () => {
            const response = await request(app)
                .delete(`/api/messages/${testMessage.id}`)
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(204);

            // Verificar se a mensagem foi realmente deletada
            const messageExists = await prisma.message.findUnique({
                where: { id: testMessage.id },
            });
            expect(messageExists).toBeNull();
        });

        it("deve impedir que outros usuários deletem mensagens", async () => {
            const response = await request(app)
                .delete(`/api/messages/${testMessage.id}`)
                .set("Authorization", `Bearer ${freelancerToken}`);

            expect(response.status).toBe(403);
        });

        it("deve retornar 404 para mensagem inexistente", async () => {
            const response = await request(app)
                .delete("/api/messages/id-inexistente")
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(404);
        });
    });
});
