import express, { Router } from 'express';
import userController from '../controllers/user.controller';


const router: Router = express.Router();

// CRUD Operations - Methods are automatically bound via BaseController
router.get('/', userController.getUsers);

export default router;