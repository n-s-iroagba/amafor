import { AcademySessionRepository } from '../repositories/AcademySessionRepository';
import { Trialist } from '../models';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';
import { structuredLogger, tracer } from '../utils';

export class AcademyService {
    private repository: AcademySessionRepository;

    constructor() {
        this.repository = new AcademySessionRepository();
    }

    public async getSessionsForMonth(year: number, month: number): Promise<any[]> {
        return tracer.startActiveSpan('service.AcademyService.getSessionsForMonth', async (span) => {
            try {
                const sessions = await this.repository.getSessionsByMonth(year, month);

                // Format for frontend
                return sessions.map(session => ({
                    id: session.id,
                    date: session.date,
                    title: session.title,
                    type: session.type,
                    attendees: (session as any).attendees?.map((att: any) => ({
                        id: att.attendeeId,
                        name: att.attendeeName,
                        status: att.status
                    })) || []
                }));
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    }

    public async logAttendance(sessionId: string, attendeeId: string, status: string, attendeeName?: string): Promise<any> {
        return tracer.startActiveSpan('service.AcademyService.logAttendance', async (span) => {
            try {
                if (!['present', 'absent', 'pending'].includes(status)) {
                    throw new AppError('Invalid status', 400);
                }

                return await this.repository.addOrUpdateAttendance({
                    sessionId,
                    attendeeId,
                    status,
                    attendeeName
                });
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    }

    public async getRecipients(group: string): Promise<any[]> {
        return tracer.startActiveSpan('service.AcademyService.getRecipients', async (span) => {
            try {
                const trialists = await Trialist.findAll({
                    attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'guardianName', 'guardianEmail', 'guardianPhone', 'status']
                });

                const recipients: any[] = [];

                if (group === 'trialists' || group === 'all') {
                    trialists.forEach(t => {
                        recipients.push({
                            id: t.id,
                            name: `${t.firstName} ${t.lastName}`,
                            email: t.email,
                            phone: t.phone
                        });
                    });
                }

                if (group === 'guardians' || group === 'all') {
                    trialists.forEach(t => {
                        if (t.guardianName || t.guardianEmail || t.guardianPhone) {
                            recipients.push({
                                id: `guardian-${t.id}`,
                                name: t.guardianName || `Guardian of ${t.firstName}`,
                                email: t.guardianEmail,
                                phone: t.guardianPhone,
                                guardianName: t.guardianName
                            });
                        }
                    });
                }

                return recipients;
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    }

    public async sendCommunications(data: { channel: string; body: string; group: string; recipients: string[] }): Promise<any> {
        return tracer.startActiveSpan('service.AcademyService.sendCommunications', async (span) => {
            try {
                logger.info(`Sending ${data.channel} to ${data.recipients.length} recipients in group ${data.group}`, {
                    body: data.body
                });
                return { success: true, count: data.recipients.length };
            } catch (error: any) {
                span.setStatus({ code: 2, message: error.message });
                throw error;
            } finally {
                span.end();
            }
        });
    }
}
