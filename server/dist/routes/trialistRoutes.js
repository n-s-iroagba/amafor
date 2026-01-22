"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const trialist_controller_1 = require("../controllers/trialist.controller");
const trialist_validation_1 = require("../validations/trialist.validation");
const router = express_1.default.Router();
// Create trialist (with file upload)
router.post('/', trialist_controller_1.uploadTrialistFiles, trialist_validation_1.validateFileUpload, (0, trialist_validation_1.validate)(trialist_validation_1.trialistValidationSchemas.createTrialist), trialist_controller_1.trialistController.createTrialist);
// Get all trialists with filters
router.get('/', (0, trialist_validation_1.validate)(trialist_validation_1.trialistValidationSchemas.filterQuery), trialist_controller_1.trialistController.getAllTrialists);
// Get trialist by ID
router.get('/:id', (0, trialist_validation_1.validate)(trialist_validation_1.trialistValidationSchemas.trialistIdParam), trialist_controller_1.trialistController.getTrialistById);
// Update trialist
router.put('/:id', trialist_controller_1.uploadTrialistFiles, trialist_validation_1.validateFileUpload, (0, trialist_validation_1.validate)(trialist_validation_1.trialistValidationSchemas.updateTrialist), trialist_controller_1.trialistController.updateTrialist);
// Delete trialist
router.delete('/:id', (0, trialist_validation_1.validate)(trialist_validation_1.trialistValidationSchemas.trialistIdParam), trialist_controller_1.trialistController.deleteTrialist);
// Update trialist status
router.patch('/:id/status', (0, trialist_validation_1.validate)(trialist_validation_1.trialistValidationSchemas.updateStatus), trialist_controller_1.trialistController.updateStatus);
// Search trialists
router.get('/search', (0, trialist_validation_1.validate)(trialist_validation_1.trialistValidationSchemas.searchQuery), trialist_controller_1.trialistController.searchTrialists);
// Get statistics
router.get('/stats', trialist_controller_1.trialistController.getStatistics);
exports.default = router;
//# sourceMappingURL=trialistRoutes.js.map