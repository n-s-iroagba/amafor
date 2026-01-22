"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
// We assume a validate middleware exists that uses your schema validation
const validation_1 = require("../middleware/validation");
const user_1 = __importDefault(require("../schemas/user")); // Assuming schema structure based on project contents
const router = (0, express_1.Router)();
const authController = new AuthController_1.AuthController();
router.post('/register', (0, validation_1.validateRequest)(user_1.default.register), authController.register);
router.post('/login', (0, validation_1.validateRequest)(user_1.default.login), authController.login);
router.post('/logout', authController.logout);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map