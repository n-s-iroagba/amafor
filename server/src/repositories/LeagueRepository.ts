
import League, { LeagueAttributes, LeagueCreationAttributes } from '../models/League';
import { BaseRepository } from './BaseRepository';

export class LeagueRepository extends BaseRepository<League> {
    constructor() {
        super(League);
    }
}
