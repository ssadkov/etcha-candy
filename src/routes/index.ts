import { Router } from 'express';
import { CollectionController } from '../controllers/CollectionController';
import { TicketController } from '../controllers/TicketController';

export function createRoutes(
  collectionController: CollectionController,
  ticketController: TicketController
): Router {
  const router = Router();

  // Collection routes
  router.post('/collections', (req, res) => collectionController.createCollection(req, res));
  router.get('/collections', (req, res) => collectionController.getCollections(req, res));
  router.get('/collections/:id', (req, res) => collectionController.getCollectionById(req, res));
  router.put('/collections/:id', (req, res) => collectionController.updateCollection(req, res));
  router.delete('/collections/:id', (req, res) => collectionController.deleteCollection(req, res));
  
  // Candy Machine routes
  router.post('/collections/:id/candy-machine', (req, res) => collectionController.createCandyMachine(req, res));
  router.get('/collections/:id/candy-machine', (req, res) => collectionController.getCandyMachineInfo(req, res));

  // Ticket routes
  router.post('/tickets/mint', (req, res) => ticketController.mintTicket(req, res));
  router.get('/tickets/user/:wallet', (req, res) => ticketController.getUserTickets(req, res));
  router.post('/tickets/validate', (req, res) => ticketController.validateTicket(req, res));
  
  // Test wallet routes
  router.get('/test-wallets', (req, res) => ticketController.getTestWallets(req, res));

  return router;
}
