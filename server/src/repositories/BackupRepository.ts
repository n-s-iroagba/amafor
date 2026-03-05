import Backup from '../models/Backup';
import { BaseRepository } from './BaseRepository';

export class BackupRepository extends BaseRepository<Backup> {
    constructor() {
        super(Backup);
    }
}
