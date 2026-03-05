import { AcademySession, AcademyAttendance } from '../models';
import { AppError } from '../utils/errors';
import { Op } from 'sequelize';

export class AcademySessionRepository {
    public async createSession(data: any): Promise<any> {
        return await AcademySession.create(data);
    }

    public async getSessionsByMonth(year: number, month: number): Promise<any[]> {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        return await AcademySession.findAll({
            where: {
                date: {
                    [Op.between]: [startDate, endDate]
                }
            },
            include: [
                {
                    model: AcademyAttendance,
                    as: 'attendees'
                }
            ],
            order: [['date', 'ASC']]
        });
    }

    public async getSessionById(id: string): Promise<any> {
        return await AcademySession.findByPk(id, {
            include: [
                {
                    model: AcademyAttendance,
                    as: 'attendees'
                }
            ]
        });
    }

    public async addOrUpdateAttendance(data: { sessionId: string; attendeeId: string; status: string; attendeeName?: string }): Promise<any> {
        const session = await AcademySession.findByPk(data.sessionId);
        if (!session) throw new AppError('Session not found', 404);

        let attendance = await AcademyAttendance.findOne({
            where: {
                sessionId: data.sessionId,
                attendeeId: data.attendeeId
            }
        });

        if (attendance) {
            attendance.status = data.status as any;
            if (data.attendeeName) {
                attendance.attendeeName = data.attendeeName;
            }
            await attendance.save();
        } else {
            attendance = await AcademyAttendance.create({
                sessionId: data.sessionId,
                attendeeId: data.attendeeId,
                status: data.status as any,
                attendeeName: data.attendeeName || 'Unknown'
            });
        }

        return attendance;
    }
}
