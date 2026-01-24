"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoutReportRepository = void 0;
const ScoutReport_1 = __importDefault(require("../models/ScoutReport"));
const BaseRepository_1 = require("./BaseRepository");
class ScoutReportRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(ScoutReport_1.default);
    }
}
exports.ScoutReportRepository = ScoutReportRepository;
//# sourceMappingURL=ScoutReportRepository.js.map