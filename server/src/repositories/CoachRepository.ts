// repositories/CoachRepository.ts
import Coach from '../models/Coach';
import { BaseRepository } from './BaseRepository';

class CoachRepository extends BaseRepository<Coach> {
  constructor() {
    super(Coach);
  }
}

export default CoachRepository;