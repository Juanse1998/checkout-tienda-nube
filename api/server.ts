import jsonServer from 'json-server';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import type { Request, Response, NextFunction } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults({
  static: join(__dirname, 'public')
});

// CORS middleware
server.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Token validation middleware
server.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST') {
    req.body.createdAt = new Date().toISOString();
    
    if (req.path === '/tokens') {
      const { token, last4, brand } = req.body;
      
      if (!token || !last4 || !brand) {
        return res.status(400).json({ 
          error: 'Faltan campos requeridos: token, last4, brand' 
        });
      }

      if (req.body.cardNumber || req.body.cvv || req.body.pan) {
        return res.status(400).json({ 
          error: 'No se permiten datos sensibles (PAN/CVV)' 
        });
      }

      // Simular rechazo de tarjetas específicas (para testing)
      const rejectedCards = ['0000', '9999', '6666'];
      if (rejectedCards.includes(last4)) {
        console.log('Tarjeta rechazada:', last4);
        return res.status(402).json({ 
          error: 'Pago rechazado por el banco. Por favor, intenta con otra tarjeta.' 
        });
      }

      console.log('Token creado:', { token, last4, brand });
    }
  }
  next();
});

// Payment logging endpoint
server.post('/payments', (req: Request, res: Response, next: NextFunction) => {
  console.log('Registro de pago:', {
    status: req.body.status,
    timestamp: req.body.timestamp,
    last4: req.body.last4
  });
  next();
});

server.use(router);

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`JSON Server corriendo en http://localhost:${PORT}`);
});
