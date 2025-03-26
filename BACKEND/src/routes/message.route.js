import express from 'express'
import { protectedRoute } from '../middleware/auth.middleware.js';
import { getMessages, getUsersForSideBar, sendMessage} from '../controllers/message.controller.js';
export const messageRoute = express.Router();
messageRoute.get('/users',protectedRoute,getUsersForSideBar)
messageRoute.get('/:id',protectedRoute,getMessages)
messageRoute.post("/send/:id",protectedRoute,sendMessage);