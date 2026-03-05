import { Request, Response, NextFunction } from 'express';
import { AcademyService } from '../services/AcademyService';

export class AcademyController {
    private academyService: AcademyService;

    constructor() {
        this.academyService = new AcademyService();
    }

    public getSessions = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const year = parseInt(req.query.year as string) || new Date().getFullYear();
            const month = parseInt(req.query.month as string) || (new Date().getMonth() + 1);

            const sessions = await this.academyService.getSessionsForMonth(year, month);
            res.status(200).json({ success: true, data: sessions });
        } catch (error) {
            next(error);
        }
    };

    public logAttendance = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { sessionId, attendeeId, status, attendeeName } = req.body;

            if (!sessionId || !attendeeId || !status) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }

            const attendance = await this.academyService.logAttendance(sessionId, attendeeId, status, attendeeName);
            res.status(200).json({ success: true, message: 'Attendance logged successfully', data: attendance });
        } catch (error) {
            next(error);
        }
    };

    public getRecipients = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { group } = req.params;
            const validGroups = ['trialists', 'guardians', 'all'];

            if (!validGroups.includes(group)) {
                return res.status(400).json({ success: false, message: 'Invalid group parameter' });
            }

            const recipients = await this.academyService.getRecipients(group);
            res.status(200).json({ success: true, data: recipients });
        } catch (error) {
            next(error);
        }
    };

    public sendCommunications = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { channel, body, group, recipients } = req.body;

            if (!channel || !body || !recipients || !Array.isArray(recipients)) {
                return res.status(400).json({ success: false, message: 'Missing required fields' });
            }

            const result = await this.academyService.sendCommunications({ channel, body, group, recipients });
            res.status(200).json({ success: true, message: 'Message dispatched successfully', data: result });
        } catch (error) {
            next(error);
        }
    };
}
