import { Router } from 'express'
import { PaymentController } from '../controllers/PaymentController'
import { PaymentGatewayController } from '../controllers/PaymentGatewayController'

const router = Router()
const paymentController = new PaymentController();

// PaymentGatewayController methods are static
router.get('/advertiser', (req, res) => paymentController.getAdvertiserPayments(req, res))
router.get('/', (req, res) => paymentController.getAllPayments(req, res))

router.post('/initialize', PaymentGatewayController.initializePayment)
router.post('/verify/:reference', PaymentGatewayController.verifyTransaction)
router.post('/webhook', PaymentGatewayController.handleWebhook)

export default router