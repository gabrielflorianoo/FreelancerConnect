import { Router } from "express";
import * as userController from "../controllers/userController.js";
import { authenticate, isAdmin } from "../controllers/authMiddleware.js";

const router = Router();

// Rotas públicas
router.post("/register", userController.createUser);
router.post("/login", userController.loginUser);

// Rotas protegidas
router.get("/", authenticate, isAdmin, userController.getAllUsers); // Admin: Listar todos os usuários
router.get("/freelancers", userController.getFreelancers); // Público: Listar freelancers
router.get("/profile/:id", authenticate, userController.getUserById); // Autenticado: Ver perfil
router.put("/profile/:id", authenticate, userController.updateUser); // Autenticado: Atualizar próprio perfil
router.delete("/profile/:id", authenticate, userController.deleteUser); // Autenticado: Deletar próprio perfil
router.put("/balance/:id", authenticate, userController.updateBalance); // Admin: Atualizar saldo
router.get("/auth/me", authenticate, userController.getAuthenticatedUser); // Autenticado: Obter usuário autenticado
router.post("/auth/logout", authenticate, userController.logoutUser); // Autenticado: Logout

export default router;
