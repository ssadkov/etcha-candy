"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRoutes = createRoutes;
const express_1 = require("express");
function createRoutes(collectionController, ticketController) {
    const router = (0, express_1.Router)();
    router.post('/collections', (req, res) => collectionController.createCollection(req, res));
    router.get('/collections', (req, res) => collectionController.getCollections(req, res));
    router.get('/collections/:id', (req, res) => collectionController.getCollectionById(req, res));
    router.put('/collections/:id', (req, res) => collectionController.updateCollection(req, res));
    router.delete('/collections/:id', (req, res) => collectionController.deleteCollection(req, res));
    router.post('/collections/:id/candy-machine', (req, res) => collectionController.createCandyMachine(req, res));
    router.get('/collections/:id/candy-machine', (req, res) => collectionController.getCandyMachineInfo(req, res));
    router.post('/tickets/mint', (req, res) => ticketController.mintTicket(req, res));
    router.get('/tickets/user/:wallet', (req, res) => ticketController.getUserTickets(req, res));
    router.post('/tickets/validate', (req, res) => ticketController.validateTicket(req, res));
    return router;
}
//# sourceMappingURL=index.js.map