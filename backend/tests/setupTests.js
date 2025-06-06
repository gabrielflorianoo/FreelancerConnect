import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

// Cliente Prisma para testes
export const prisma = new PrismaClient();

// Limpar base de dados para testes
export const setupDatabase = async () => {
    try {
        // Remover dados na ordem inversa das relações para evitar problemas de chaves estrangeiras
        await prisma.payment.deleteMany({});
        await prisma.review.deleteMany({});
        await prisma.message.deleteMany({});
        await prisma.job.deleteMany({});
        await prisma.user.deleteMany({});
    } catch (error) {
        console.error("Erro ao limpar banco de dados:", error);
    }
};

// Funções auxiliares para testes
export const createTestUser = async (userData = {}) => {
    // Gerar hash para senha de teste
    const hashedPassword = await bcrypt.hash("senha123", 10);

    const defaultUser = {
        name: "Usuário de Teste",
        email: "teste@example.com",
        password: hashedPassword, // Senha hasheada corretamente
        role: "CLIENT",
    };

    const user = await prisma.user.create({
        data: {
            ...defaultUser,
            ...userData,
        },
    });

    return user;
};

export const generateAuthToken = (userId, role = "CLIENT") => {
    return jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET || "test-secret-key",
        { expiresIn: "1h" },
    );
};

export const closeDatabase = async () => {
    await prisma.$disconnect();
};
