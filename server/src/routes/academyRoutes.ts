import express from 'express';

const router = express.Router();

// Placeholder routes
router.get('/', (req, res) => {
    res.json({ message: 'Academy routes working' });
});

export default router;
