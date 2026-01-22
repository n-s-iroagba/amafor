
import PatronSubscriptionPackage from '@models/PatronSubscriptionPackage';
import { BaseRepository } from './BaseRepository';




export class PatronSubscriptionPackageRepository extends BaseRepository<PatronSubscriptionPackage> {
 

  constructor() {
    super(PatronSubscriptionPackage);
  
  }

}