"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PlayerController_1 = require("../controllers/PlayerController");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
const controller = new PlayerController_1.PlayerController();
// Public
router.get('/', controller.listPlayers);
router.get('/:id', controller.getPlayerProfile);
// Admin/Scout Protected
router.use(middlewares_1.authMiddleware);
router.post('/', (0, middlewares_1.rbacMiddleware)(['admin', 'scout']), controller.createPlayer);
router.patch('/:id/stats', (0, middlewares_1.rbacMiddleware)(['admin', 'coach']), controller.updateStats);
router.get('/:id/report', (0, middlewares_1.rbacMiddleware)(['admin', 'scout']), controller.generateScoutReport);
exports.default = router;
//# sourceMappingURL=playerRoutes.js.map