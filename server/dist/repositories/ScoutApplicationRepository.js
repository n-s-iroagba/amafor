"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoutApplicationRepository = void 0;
const ScoutApplication_1 = __importDefault(require("../models/ScoutApplication"));
const BaseRepository_1 = require("./BaseRepository");
class ScoutApplicationRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(ScoutApplication_1.default);
    }
}
exports.ScoutApplicationRepository = ScoutApplicationRepository;
//# sourceMappingURL=ScoutApplicationRepository.js.map