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

// Mock das funções do bcrypt para testes
jest.mock("bcrypt", () => ({
    hash: jest.fn(() => Promise.resolve("hash-senha-mockada")),
    compare: jest.fn(() => Promise.resolve(true)),
}));

describe("Testes da API de Usuários", () => {
    let testUser;
    let adminUser;
    let testToken;
    let adminToken;

    // Configurar banco de dados antes de cada teste
    beforeEach(async () => {
        await setupDatabase();

        // Criar usuário de teste
        testUser = await createTestUser();
        testToken = generateAuthToken(testUser.id, "CLIENT");

        // Criar usuário admin
        adminUser = await createTestUser({
            email: "admin@example.com",
            role: "ADMIN",
        });
        adminToken = generateAuthToken(adminUser.id, "ADMIN");
    });

    // Fechar conexão com banco de dados após todos os testes
    afterAll(async () => {
        await closeDatabase();
    });

    // Testes de registro de usuário
    describe("POST /api/users/register", () => {
        it("deve registrar um novo usuário com sucesso", async () => {
            const response = await request(app)
                .post("/api/users/register")
                .send({
                    name: "Novo Usuário",
                    email: "novo@example.com",
                    password: "senha123",
                    role: "CLIENT",
                });

            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("name", "Novo Usuário");
            expect(response.body).toHaveProperty("email", "novo@example.com");
            expect(response.body).not.toHaveProperty("password");
        });

        it("deve retornar erro se o email já estiver em uso", async () => {
            const response = await request(app)
                .post("/api/users/register")
                .send({
                    name: "Usuário Duplicado",
                    email: testUser.email, // Email já cadastrado
                    password: "senha123",
                });

            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty(
                "message",
                "Este e-mail já está em uso",
            );
        });
    });

    // Testes de login
    describe("POST /api/users/login", () => {
        it("deve fazer login com sucesso", async () => {
            const response = await request(app).post("/api/users/login").send({
                email: testUser.email,
                password: "senha123", // Senha simples que será aceita pelo mock do bcrypt
            });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("token");
            expect(response.body).toHaveProperty("user");
            expect(response.body.user).toHaveProperty("id", testUser.id);
        });

        it("deve retornar erro se as credenciais forem inválidas", async () => {
            // Alteramos o mock para retornar false
            jest.requireMock("bcrypt").compare.mockResolvedValueOnce(false);

            const response = await request(app).post("/api/users/login").send({
                email: testUser.email,
                password: "senha-errada",
            });

            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty(
                "message",
                "Credenciais inválidas",
            );
        });
    });

    // Testes de listagem de usuários (apenas admin)
    describe("GET /api/users", () => {
        it("deve listar todos os usuários para admin", async () => {
            const response = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${adminToken}`);

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(2); // testUser e adminUser
        });

        it("deve negar acesso para usuários não-admin", async () => {
            const response = await request(app)
                .get("/api/users")
                .set("Authorization", `Bearer ${testToken}`);

            expect(response.status).toBe(403);
        });
    });

    // Testes de obtenção de perfil
    describe("GET /api/users/profile/:id", () => {
        it("deve retornar o perfil do usuário autenticado", async () => {
            const response = await request(app)
                .get(`/api/users/profile/${testUser.id}`)
                .set("Authorization", `Bearer ${testToken}`);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("id", testUser.id);
            expect(response.body).toHaveProperty("name", testUser.name);
            expect(response.body).not.toHaveProperty("password");
        });

        it("deve retornar 404 para usuário inexistente", async () => {
            const response = await request(app)
                .get("/api/users/profile/id-inexistente")
                .set("Authorization", `Bearer ${testToken}`);

            expect(response.status).toBe(404);
        });
    });

    // Testes de atualização de perfil
    describe("PUT /api/users/profile/:id", () => {
        it("deve atualizar o perfil do usuário", async () => {
            const response = await request(app)
                .put(`/api/users/profile/${testUser.id}`)
                .set("Authorization", `Bearer ${testToken}`)
                .send({
                    name: "Nome Atualizado",
                    bio: "Nova biografia",
                });

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("name", "Nome Atualizado");
            expect(response.body).toHaveProperty("bio", "Nova biografia");
        });
    });

    // Testes de listagem de freelancers
    describe("GET /api/users/freelancers", () => {
        it("deve listar freelancers", async () => {
            // Criar um freelancer de teste
            await createTestUser({
                email: "freelancer@example.com",
                role: "FREELANCER",
            });

            const response = await request(app).get("/api/users/freelancers");

            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1); // Apenas o freelancer
        });
    });

    // Testes de deleção de usuário
    describe("DELETE /api/users/profile/:id", () => {
        it("deve permitir que um usuário delete seu próprio perfil", async () => {
            const response = await request(app)
                .delete(`/api/users/profile/${testUser.id}`)
                .set("Authorization", `Bearer ${testToken}`);

            expect(response.status).toBe(204);

            // Verificar se o usuário foi realmente deletado
            const userExists = await prisma.user.findUnique({
                where: { id: testUser.id },
            });
            expect(userExists).toBeNull();
        });

        it("deve impedir que um usuário delete o perfil de outro", async () => {
            const response = await request(app)
                .delete(`/api/users/profile/${adminUser.id}`)
                .set("Authorization", `Bearer ${testToken}`);

            expect(response.status).toBe(403);
        });
    });
});
