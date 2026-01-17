"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const articleRoutes_1 = __importDefault(require("./articleRoutes"));
const router = (0, express_1.Router)();
router.use('/articles', articleRoutes_1.default);
// router.use('/auth', authRoutes);
exports.default = router;
//# sourceMappingURL=index.js.map