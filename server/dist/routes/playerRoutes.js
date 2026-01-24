"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PlayerController_1 = require("../controllers/PlayerController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const controller = new PlayerController_1.PlayerController();
// Public
router.get('/', controller.listPlayers);
router.get('/:id', controller.getPlayerProfile);
// Admin/Scout Protected
router.use(auth_1.authenticate);
router.post('/', (0, auth_1.authorize)(['admin', 'scout']), controller.createPlayer);
router.patch('/:id/stats', (0, auth_1.authorize)(['admin', 'coach']), controller.updateStats);
router.get('/:id/report', (0, auth_1.authorize)(['admin', 'scout']), controller.generateScoutReport);
exports.default = router;
//# sourceMappingURL=playerRoutes.js.map