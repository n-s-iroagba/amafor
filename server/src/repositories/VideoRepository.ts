import { BaseRepository } from './BaseRepository';
import Video from '../models/Video';

export class VideoRepository extends BaseRepository<Video> {
    constructor() {
        super(Video);
    }
}

export default VideoRepository;
