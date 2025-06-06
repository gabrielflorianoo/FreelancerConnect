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

describe("Testes da API de Jobs", () => {
    let clientUser;
    let freelancerUser;
    let clientToken;
    let freelancerToken;
    let testJob;

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
            },
        });
    });

    // Fechar conexão com banco de dados após todos os testes
    afterAll(async () => {
        await closeDatabase();
    });

    // Testes de listagem de jobs
    describe("GET /api/jobs", () => {
        it("deve listar todos os jobs disponíveis", async () => {
            const response = await request(app).get("/api/jobs");

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1); // Apenas o job de teste
            expect(response.body[0]).toHaveProperty("id", testJob.id);
        });

        it("deve filtrar jobs por categoria", async () => {
            // Criar um job com categoria diferente
            await prisma.job.create({
                data: {
                    title: "Job de Design",
                    description: "Descrição do job de design",
                    category: "Design",
                    location: "Remoto",
                    price: 800,
                    status: "PENDING",
                    client: {
                        connect: { id: clientUser.id },
                    },
                },
            });

            const response = await request(app)
                .get("/api/jobs")
                .query({ category: "Design" });

            expect(response.status).toBe(200);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toHaveProperty("category", "Design");
        });
    });

    // Testes de obtenção de job específico
    describe("GET /api/jobs/:id", () => {
        it("deve retornar os detalhes de um job específico", async () => {
            const response = await request(app)
                .get(`/api/jobs/${testJob.id}`)
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id", testJob.id);
            expect(response.body).toHaveProperty("title", testJob.title);
            expect(response.body).toHaveProperty("client");
            expect(response.body.client).toHaveProperty("id", clientUser.id);
        });

        it("deve retornar 404 para job inexistente", async () => {
            const response = await request(app)
                .get("/api/jobs/id-inexistente")
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(404);
        });
    });

    // Testes de criação de job
    describe("POST /api/jobs", () => {
        it("deve permitir que um cliente crie um novo job", async () => {
            const jobData = {
                title: "Novo Job",
                description: "Descrição do novo job",
                category: "Desenvolvimento Web",
                location: "São Paulo",
                price: 1500,
            };

            const response = await request(app)
                .post("/api/jobs")
                .set("Authorization", `Bearer ${clientToken}`)
                .send(jobData);

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("title", jobData.title);
            expect(response.body).toHaveProperty("price", jobData.price);
            expect(response.body).toHaveProperty("client");
            expect(response.body.client).toHaveProperty("id", clientUser.id);
        });

        it("deve impedir que um freelancer crie um job", async () => {
            const response = await request(app)
                .post("/api/jobs")
                .set("Authorization", `Bearer ${freelancerToken}`)
                .send({
                    title: "Job Inválido",
                    description: "Descrição",
                    category: "Teste",
                    location: "Remoto",
                    price: 100,
                });

            expect(response.status).toBe(403);
        });
    });

    // Testes de atualização de job
    describe("PUT /api/jobs/:id", () => {
        it("deve permitir que o cliente atualize seu próprio job", async () => {
            const response = await request(app)
                .put(`/api/jobs/${testJob.id}`)
                .set("Authorization", `Bearer ${clientToken}`)
                .send({
                    title: "Título Atualizado",
                    price: 1200,
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("title", "Título Atualizado");
            expect(response.body).toHaveProperty("price", 1200);
        });

        it("deve impedir que outro usuário atualize o job", async () => {
            const response = await request(app)
                .put(`/api/jobs/${testJob.id}`)
                .set("Authorization", `Bearer ${freelancerToken}`)
                .send({
                    title: "Tentativa de Alteração",
                });

            expect(response.status).toBe(403);
        });
    });

    // Testes de aceitação de job
    describe("PUT /api/jobs/:id/accept", () => {
        it("deve permitir que um freelancer aceite um job", async () => {
            const response = await request(app)
                .put(`/api/jobs/${testJob.id}/accept`)
                .set("Authorization", `Bearer ${freelancerToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("status", "ACCEPTED");
            expect(response.body).toHaveProperty("freelancer");
            expect(response.body.freelancer).toHaveProperty(
                "id",
                freelancerUser.id,
            );
        });

        it("deve impedir que um cliente aceite um job", async () => {
            const response = await request(app)
                .put(`/api/jobs/${testJob.id}/accept`)
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(403);
        });
    });

    // Testes de finalização de job
    describe("PUT /api/jobs/:id/complete", () => {
        it("deve permitir que um cliente marque um job como completo", async () => {
            // Primeiro, aceitar o job com um freelancer
            await prisma.job.update({
                where: { id: testJob.id },
                data: {
                    status: "ACCEPTED",
                    freelancerId: freelancerUser.id,
                },
            });

            const response = await request(app)
                .put(`/api/jobs/${testJob.id}/complete`)
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("status", "COMPLETED");
        });

        it("deve impedir a finalização de um job não aceito", async () => {
            const response = await request(app)
                .put(`/api/jobs/${testJob.id}/complete`)
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty(
                "message",
                "Este job precisa estar em andamento para ser finalizado",
            );
        });
    });

    // Testes de cancelamento de job
    describe("PUT /api/jobs/:id/cancel", () => {
        it("deve permitir que um cliente cancele seu job", async () => {
            const response = await request(app)
                .put(`/api/jobs/${testJob.id}/cancel`)
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("status", "CANCELLED");
        });

        it("deve permitir que o freelancer cancele um job aceito", async () => {
            // Primeiro, aceitar o job com um freelancer
            await prisma.job.update({
                where: { id: testJob.id },
                data: {
                    status: "ACCEPTED",
                    freelancerId: freelancerUser.id,
                },
            });

            const response = await request(app)
                .put(`/api/jobs/${testJob.id}/cancel`)
                .set("Authorization", `Bearer ${freelancerToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("status", "CANCELLED");
        });
    });

    // Testes de deleção de job
    describe("DELETE /api/jobs/:id", () => {
        it("deve permitir que um cliente delete seu próprio job", async () => {
            const response = await request(app)
                .delete(`/api/jobs/${testJob.id}`)
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(204);

            // Verificar se o job foi realmente deletado
            const jobExists = await prisma.job.findUnique({
                where: { id: testJob.id },
            });
            expect(jobExists).toBeNull();
        });

        it("deve impedir que outro usuário delete o job", async () => {
            const response = await request(app)
                .delete(`/api/jobs/${testJob.id}`)
                .set("Authorization", `Bearer ${freelancerToken}`);

            expect(response.status).toBe(403);
        });
    });
});
