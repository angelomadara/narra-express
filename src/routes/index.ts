import { Application } from 'express';
import apiRoutes from './api';
import earthquakeRoutes from './earthquake.route';
import weatherRoutes from './weather';
import usersRoutes from './users.route';

export const registerRoutes = (app: Application) => {
  // Register all routes here
  app.use('/api/api', apiRoutes);
  app.use('/api/earthquake', earthquakeRoutes);
  app.use('/api/weather', weatherRoutes);
  app.use('/api/users', usersRoutes);

};