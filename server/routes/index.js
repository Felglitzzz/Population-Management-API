import express from 'express';
import HomeController from '../controllers/Home.controller';

const router = express.Router();

router.get('/home', HomeController.welcomeMessage);

export default router;
