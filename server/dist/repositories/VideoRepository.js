"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const Video_1 = __importDefault(require("../models/Video"));
class VideoRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(Video_1.default);
    }
}
exports.VideoRepository = VideoRepository;
exports.default = VideoRepository;
//# sourceMappingURL=VideoRepository.js.map