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

describe("Testes da API de Reviews (Avaliações)", () => {
    let clientUser;
    let freelancerUser;
    let clientToken;
    let freelancerToken;
    let testJob;
    let testReview;

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

        // Criar uma avaliação de teste
        testReview = await prisma.review.create({
            data: {
                rating: 4,
                comment: "Ótimo trabalho!",
                job: {
                    connect: { id: testJob.id },
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

    // Testes de obtenção de avaliações de um freelancer
    describe("GET /api/reviews/freelancer/:freelancerId", () => {
        it("deve retornar avaliações de um freelancer", async () => {
            const response = await request(app).get(
                `/api/reviews/freelancer/${freelancerUser.id}`,
            );

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);
            expect(response.body[0]).toHaveProperty("rating", 4);
            expect(response.body[0]).toHaveProperty(
                "comment",
                "Ótimo trabalho!",
            );
        });

        it("deve retornar lista vazia para freelancer sem avaliações", async () => {
            // Criar outro freelancer sem avaliações
            const otherFreelancer = await createTestUser({
                email: "outro.freelancer@example.com",
                role: "FREELANCER",
            });

            const response = await request(app).get(
                `/api/reviews/freelancer/${otherFreelancer.id}`,
            );

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(0);
        });

        it("deve retornar 404 para freelancer inexistente", async () => {
            const response = await request(app).get(
                "/api/reviews/freelancer/id-inexistente",
            );

            expect(response.status).toBe(404);
        });
    });

    // Testes de obtenção de avaliação específica
    describe("GET /api/reviews/:id", () => {
        it("deve retornar detalhes de uma avaliação específica", async () => {
            const response = await request(app)
                .get(`/api/reviews/${testReview.id}`)
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id", testReview.id);
            expect(response.body).toHaveProperty("rating", 4);
            expect(response.body).toHaveProperty("comment", "Ótimo trabalho!");
        });

        it("deve retornar 404 para avaliação inexistente", async () => {
            const response = await request(app)
                .get("/api/reviews/id-inexistente")
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(404);
        });
    });

    // Testes de criação de avaliação
    describe("POST /api/reviews/job/:jobId", () => {
        it("deve permitir que um cliente crie uma avaliação para um job completado", async () => {
            // Criar um novo job completado para testar nova avaliação
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
                .post(`/api/reviews/job/${newJob.id}`)
                .set("Authorization", `Bearer ${clientToken}`)
                .send({
                    rating: 5,
                    comment: "Excelente trabalho!",
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("rating", 5);
            expect(response.body).toHaveProperty(
                "comment",
                "Excelente trabalho!",
            );
        });

        it("deve impedir que um freelancer crie uma avaliação", async () => {
            // Criar um novo job completado
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
                .post(`/api/reviews/job/${newJob.id}`)
                .set("Authorization", `Bearer ${freelancerToken}`)
                .send({
                    rating: 5,
                    comment: "Tentativa de avaliação",
                });

            expect(response.status).toBe(403);
        });

        it("deve impedir avaliação de job não completado", async () => {
            // Criar um job pendente
            const pendingJob = await prisma.job.create({
                data: {
                    title: "Job Pendente",
                    description: "Descrição do job pendente",
                    category: "Escrita",
                    location: "Remoto",
                    price: 200,
                    status: "PENDING",
                    client: {
                        connect: { id: clientUser.id },
                    },
                    freelancer: {
                        connect: { id: freelancerUser.id },
                    },
                },
            });

            const response = await request(app)
                .post(`/api/reviews/job/${pendingJob.id}`)
                .set("Authorization", `Bearer ${clientToken}`)
                .send({
                    rating: 5,
                    comment: "Tentativa de avaliação",
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty(
                "message",
                "O job precisa estar completo para ser avaliado",
            );
        });

        it("deve impedir avaliação duplicada para o mesmo job", async () => {
            const response = await request(app)
                .post(`/api/reviews/job/${testJob.id}`)
                .set("Authorization", `Bearer ${clientToken}`)
                .send({
                    rating: 3,
                    comment: "Tentativa de segunda avaliação",
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty(
                "message",
                "Este job já foi avaliado",
            );
        });
    });

    // Testes de atualização de avaliação
    describe("PUT /api/reviews/:id", () => {
        it("deve permitir que o cliente atualize sua avaliação", async () => {
            const response = await request(app)
                .put(`/api/reviews/${testReview.id}`)
                .set("Authorization", `Bearer ${clientToken}`)
                .send({
                    rating: 5,
                    comment: "Avaliação atualizada",
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("rating", 5);
            expect(response.body).toHaveProperty(
                "comment",
                "Avaliação atualizada",
            );
        });

        it("deve impedir que o freelancer atualize uma avaliação", async () => {
            const response = await request(app)
                .put(`/api/reviews/${testReview.id}`)
                .set("Authorization", `Bearer ${freelancerToken}`)
                .send({
                    rating: 5,
                    comment: "Tentativa de alteração",
                });

            expect(response.status).toBe(403);
        });
    });

    // Testes de deleção de avaliação
    describe("DELETE /api/reviews/:id", () => {
        it("deve permitir que o cliente delete sua avaliação", async () => {
            const response = await request(app)
                .delete(`/api/reviews/${testReview.id}`)
                .set("Authorization", `Bearer ${clientToken}`);

            expect(response.status).toBe(204);

            // Verificar se a avaliação foi realmente deletada
            const reviewExists = await prisma.review.findUnique({
                where: { id: testReview.id },
            });
            expect(reviewExists).toBeNull();
        });

        it("deve impedir que o freelancer delete uma avaliação", async () => {
            const response = await request(app)
                .delete(`/api/reviews/${testReview.id}`)
                .set("Authorization", `Bearer ${freelancerToken}`);

            expect(response.status).toBe(403);
        });
    });
});
