import { Router } from "express";
import * as messageController from "../controllers/messageController.js";
import { authenticate } from "../controllers/authMiddleware.js";

const router = Router();

// Todas as rotas de mensagens são protegidas
router.get("/job/:jobId", authenticate, messageController.getJobMessages); // Ver mensagens de um job
router.post("/job/:jobId", authenticate, messageController.sendMessage); // Enviar mensagem em um job
router.delete("/:id", authenticate, messageController.deleteMessage); // Deletar uma mensagem (apenas o remetente)

export default router;
