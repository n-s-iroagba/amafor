import { Request, Response } from 'express';

export class NotificationController {
    async listNotifications(req: Request, res: Response) {
        res.json({ data: [], meta: { total: 0, page: 1, limit: 10 } });
    }

    async markAsRead(req: Request, res: Response) {
        res.json({ message: 'Marked as read' });
    }

    async markAllAsRead(req: Request, res: Response) {
        res.json({ message: 'Marked all as read' });
    }
}
