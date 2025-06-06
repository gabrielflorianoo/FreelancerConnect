import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Middleware para verificar se o usuário está autenticado
export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: "Token não fornecido" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar usuário pelo ID decodificado
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
            },
        });

        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado" });
        }

        // Adicionar usuário ao objeto de requisição
        req.user = user;
        next();
    } catch (error) {
        return res
            .status(401)
            .json({
                message: "Token inválido ou expirado",
                error: error.message,
            });
    }
};

// Middleware para verificar se o usuário é admin
export const isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== "ADMIN") {
        return res.status(403).json({
            message:
                "Acesso negado. Apenas administradores podem acessar este recurso.",
        });
    }
    next();
};

// Middleware para verificar se o usuário é cliente
export const isClient = (req, res, next) => {
    if (!req.user || req.user.role !== "CLIENT") {
        return res.status(403).json({
            message:
                "Acesso negado. Apenas clientes podem acessar este recurso.",
        });
    }
    next();
};

// Middleware para verificar se o usuário é freelancer
export const isFreelancer = (req, res, next) => {
    if (!req.user || req.user.role !== "FREELANCER") {
        return res.status(403).json({
            message:
                "Acesso negado. Apenas freelancers podem acessar este recurso.",
        });
    }
    next();
};

// Middleware para verificar se o usuário é cliente ou admin
export const isClientOrAdmin = (req, res, next) => {
    if (
        !req.user ||
        (req.user.role !== "CLIENT" && req.user.role !== "ADMIN")
    ) {
        return res.status(403).json({
            message:
                "Acesso negado. Apenas clientes ou administradores podem acessar este recurso.",
        });
    }
    next();
};

// Middleware para verificar se o usuário é freelancer ou admin
export const isFreelancerOrAdmin = (req, res, next) => {
    if (
        !req.user ||
        (req.user.role !== "FREELANCER" && req.user.role !== "ADMIN")
    ) {
        return res.status(403).json({
            message:
                "Acesso negado. Apenas freelancers ou administradores podem acessar este recurso.",
        });
    }
    next();
};
