import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export type JwtPayload = {
  id: string;
  slug: string;
  type: 'student' | 'administrator';
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ error: true, message: 'Não autenticado.' });
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: true, message: 'Token inválido ou expirado.' });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: true, message: 'Não autenticado.' });
  }
  if (req.user.type !== 'administrator') {
    return res.status(403).json({ error: true, message: 'Acesso negado.' });
  }
  next();
}

export function requireSelfOrAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: true, message: 'Não autenticado.' });
  }
  const targetId = req.params.id;
  if (req.user.type === 'administrator' || req.user.id === targetId) {
    return next();
  }
  return res.status(403).json({ error: true, message: 'Acesso negado.' });
}

export function requireSelfWishlist(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ error: true, message: 'Não autenticado.' });
  }
  const targetId = req.params.id ?? req.params.studentId ?? req.body?.studentId;
  if (req.user.type === 'administrator' || req.user.id === targetId) {
    return next();
  }
  return res.status(403).json({ error: true, message: 'Acesso negado.' });
}
