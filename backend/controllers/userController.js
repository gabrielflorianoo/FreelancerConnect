import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// Obter todos os usuários
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                location: true,
                bio: true,
                services: true,
                avatarUrl: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar usuários",
            error: error.message,
        });
    }
};

// Obter um usuário pelo ID
export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                location: true,
                bio: true,
                services: true,
                avatarUrl: true,
                createdAt: true,
                updatedAt: true,
                // Inclui relacionamentos
                jobsCreated: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                    },
                },
                jobsTaken: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                    },
                },
                reviews: {
                    select: {
                        id: true,
                        rating: true,
                        comment: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar usuário",
            error: error.message,
        });
    }
};

// Criar um novo usuário (registro)
export const createUser = async (req, res) => {
    const { name, email, password, role, location, bio, phone, services } =
        req.body;

    try {
        // Verificar se o email já existe
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res
                .status(400)
                .json({ message: "Este e-mail já está em uso" });
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);

        // Criar o usuário
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "CLIENT",
                location: location || "",
                bio: bio || "",
                phone: phone || "",
                services: services || [],
            },
        });

        // Gerar JWT token
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 2 * 60 * 60 * 1000, // 2 horas
        });

        res.status(201).json({
            user: newUser,
        });
    } catch (error) {
        res.status(500).json({
            message: "Erro ao criar usuário",
            error: error.message,
        });
    }
};

// Login do usuário
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        // Gerar JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 2 * 60 * 60 * 1000, // 2 horas
        });

        res.status(201).json({ user });
    } catch (error) {
        res.status(500).json({
            message: "Erro ao fazer login",
            error: error.message,
        });
    }
};

// Atualizar um usuário
export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, location, bio, phone, services, avatarUrl } = req.body;

    try {
        // Verificar se o usuário existe
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        // Atualizar o usuário
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                name,
                location,
                bio,
                phone,
                services,
                avatarUrl,
            },
        });

        // Remover senha do objeto de retorno
        const { password: _, ...userWithoutPassword } = updatedUser;

        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao atualizar usuário",
            error: error.message,
        });
    }
};

// Deletar um usuário
export const deleteUser = async (req, res) => {
    const { id } = req.params;
    const currentUserId = req.user.id; // ID do usuário que está fazendo a requisição

    try {
        // Verificar se o usuário existe
        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        // Verificar se o usuário atual é o dono do perfil ou um administrador
        if (id !== currentUserId && req.user.role !== "ADMIN") {
            return res
                .status(403)
                .json({ message: "Não autorizado a deletar este perfil" });
        }

        // Deletar o usuário
        await prisma.user.delete({
            where: { id },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: "Erro ao deletar usuário",
            error: error.message,
        });
    }
};

// Obter freelancers
export const getFreelancers = async (req, res) => {
    try {
        const freelancers = await prisma.user.findMany({
            where: {
                role: "FREELANCER",
            },
            select: {
                id: true,
                name: true,
                location: true,
                bio: true,
                services: true,
                avatarUrl: true,
                reviews: {
                    select: {
                        rating: true,
                        comment: true,
                    },
                },
            },
        });

        res.json(freelancers);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar freelancers",
            error: error.message,
        });
    }
};

// Atualizar saldo do usuário
export const updateBalance = async (req, res) => {
    const { id } = req.params;
    const { amount } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: { balance: true },
        });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                balance: user.balance + parseFloat(amount),
            },
            select: {
                id: true,
                name: true,
                balance: true,
            },
        });

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({
            message: "Erro ao atualizar saldo",
            error: error.message,
        });
    }
};

export const getAuthenticatedUser = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                location: true,
                bio: true,
                services: true,
                avatarUrl: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        res.json({ user });
    } catch (error) {
        console.error("Erro ao buscar usuário autenticado:", error);

        res.status(500).json({
            message: "Erro ao buscar usuário autenticado",
            error: error.message,
        });
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie("token");

    res.status(200).json({ message: "Logout realizado com sucesso" });
}
