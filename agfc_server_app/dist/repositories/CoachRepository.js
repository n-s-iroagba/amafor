"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// repositories/CoachRepository.ts
const Coach_1 = __importDefault(require("../models/Coach"));
const BaseRepository_1 = require("./BaseRepository");
class CoachRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Coach_1.default);
    }
}
exports.default = CoachRepository;
//# sourceMappingURL=CoachRepository.js.map