"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisputeController = void 0;
const DisputeService_1 = require("../services/DisputeService");
const tracer_1 = __importDefault(require("../utils/tracer"));
class DisputeController {
    constructor() {
        this.createDispute = async (req, res, next) => {
            return tracer_1.default.startActiveSpan('controller.DisputeController.createDispute', async (span) => {
                try {
                    const advertiserId = req.user.id;
                    const dispute = await this.disputeService.createDispute({
                        ...req.body,
                        advertiserId
                    });
                    res.status(201).json({ success: true, data: dispute });
                }
                catch (error) {
                    span.setStatus({ code: 2, message: error.message });
                    next(error);
                }
                finally {
                    span.end();
                }
            });
        };
        this.getMyDisputes = async (req, res, next) => {
            try {
                const advertiserId = req.user.id;
                const disputes = await this.disputeService.getDisputesByAdvertiser(advertiserId);
                res.status(200).json({ success: true, data: disputes });
            }
            catch (error) {
                next(error);
            }
        };
        this.getDispute = async (req, res, next) => {
            try {
                const { id } = req.params;
                const dispute = await this.disputeService.getDisputeById(id);
                if (!dispute) {
                    res.status(404).json({ success: false, message: 'Dispute not found' });
                    return;
                }
                res.status(200).json({ success: true, data: dispute });
            }
            catch (error) {
                next(error);
            }
        };
        this.disputeService = new DisputeService_1.DisputeService();
    }
}
exports.DisputeController = DisputeController;
//# sourceMappingURL=DisputeController.js.map