import { Request, Response } from 'express';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users:string[] = [];
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
}