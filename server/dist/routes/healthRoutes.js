"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/health.ts
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    const healthResponse = {
        status: 'ok',
        timestamp: new Date().toISOString()
    };
    res.json(healthResponse);
});
exports.default = router;
//# sourceMappingURL=healthRoutes.js.map