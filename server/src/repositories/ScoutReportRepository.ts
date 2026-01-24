
import ScoutReport from '../models/ScoutReport';
import { BaseRepository } from './BaseRepository';

export class ScoutReportRepository extends BaseRepository<ScoutReport> {
    constructor() {
        super(ScoutReport);
    }
}
