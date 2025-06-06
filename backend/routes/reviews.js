import { Router } from "express";
import * as reviewController from "../controllers/reviewController.js";
import { authenticate } from "../controllers/authMiddleware.js";

const router = Router();

// Rotas públicas
router.get("/freelancer/:freelancerId", reviewController.getFreelancerReviews); // Ver avaliações de um freelancer

// Rotas protegidas
router.get("/:id", authenticate, reviewController.getReviewById); // Ver detalhes de uma avaliação
router.post("/job/:jobId", authenticate, reviewController.createReview); // Criar avaliação para um job
router.put("/:id", authenticate, reviewController.updateReview); // Atualizar avaliação (apenas o cliente)
router.delete("/:id", authenticate, reviewController.deleteReview); // Deletar avaliação (apenas o cliente ou admin)

export default router;
