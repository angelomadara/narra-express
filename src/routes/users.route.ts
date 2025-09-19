import express, { Router } from 'express';
import { getUsers } from '../controllers/user.controller';


const router: Router = express.Router();

// CRUD Operations - Bind methods to preserve 'this' context
router.get('/', getUsers);

export default router;