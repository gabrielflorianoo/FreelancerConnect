import { Router } from "express";
import * as paymentController from "../controllers/paymentController.js";
import { authenticate, isAdmin } from "../controllers/authMiddleware.js";

const router = Router();

// Todas as rotas de pagamentos são protegidas
router.get("/", authenticate, isAdmin, paymentController.getAllPayments); // Admin: Ver todos os pagamentos
router.get("/user", authenticate, paymentController.getUserPayments); // Ver pagamentos do usuário logado
router.get("/:id", authenticate, paymentController.getPaymentById); // Ver detalhes de um pagamento
router.post("/job/:jobId", authenticate, paymentController.processPayment); // Processar pagamento de um job
router.post("/withdraw", authenticate, paymentController.withdrawBalance); // Sacar saldo (freelancer)

export default router;
