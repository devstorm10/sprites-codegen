import { Router } from 'express';
import { getLLMCompletion } from '../controllers/openAIController';

// Initialize the Express Router
const router = Router();

// POST /chat/:id - Accepts an ID, an optional ChatRequestPayload, and returns a ChatResponsePayload
router.post('/:id', getLLMCompletion);

export default router;
