import { Application } from 'express';
import apiRoutes from './api';
import exampleRoute from './example.route';
import usersRoutes from './users.route';
import authRoutes from './auth.route';

export const registerRoutes = (app: Application) => {
  // Register all routes here
  app.use('/api/auth', authRoutes);
  app.use('/api/api', apiRoutes);
  app.use('/api/example', exampleRoute);
  app.use('/api/users', usersRoutes);
};