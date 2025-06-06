import { Router } from "express";
import * as jobController from "../controllers/jobController.js";
import {
    authenticate,
    isClientOrAdmin,
} from "../controllers/authMiddleware.js";

const router = Router();

// Rotas públicas
router.get("/", jobController.getAllJobs); // Listar todos os jobs disponíveis

// Rotas protegidas
router.get("/:id", authenticate, jobController.getJobById); // Ver detalhes do job
router.post("/", authenticate, isClientOrAdmin, jobController.createJob); // Criar job (cliente ou admin)
router.put("/:id", authenticate, jobController.updateJob); // Atualizar job (dono ou admin)
router.delete("/:id", authenticate, jobController.deleteJob); // Deletar job (dono ou admin)

// Ações de status do job
router.put("/:id/accept", authenticate, jobController.acceptJob); // Freelancer aceita job
router.put("/:id/complete", authenticate, jobController.completeJob); // Cliente marca job como completo
router.put("/:id/cancel", authenticate, jobController.cancelJob); // Cliente ou freelancer cancela job

export default router;
