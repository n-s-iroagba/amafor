"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const validate_1 = require("../middleware/validate");
const userSchema_1 = __importDefault(require("../validation-schema/userSchema"));
const router = (0, express_1.Router)();
const authController = new AuthController_1.AuthController();
router.post('/signup', (0, validate_1.validate)(userSchema_1.default.register), (req, res, next) => authController.signupAdvertiser(req, res, next));
router.post('/login', (0, validate_1.validate)(userSchema_1.default.login), (req, res, next) => authController.login(req, res, next));
router.post('/logout', (req, res, next) => authController.logout(req, res, next));
exports.default = router;
//# sourceMappingURL=authRoutes.js.map