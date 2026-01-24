
import ScoutApplication from '../models/ScoutApplication';
import { BaseRepository } from './BaseRepository';

export class ScoutApplicationRepository extends BaseRepository<ScoutApplication> {
    constructor() {
        super(ScoutApplication);
    }
}
