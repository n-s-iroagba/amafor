import Video, { VideoAttributes } from '@models/Video';
import { BaseSeeder } from './base-seeder';
export declare class VideoSeeder extends BaseSeeder<Video> {
    constructor();
    getData(environment: string): Promise<VideoAttributes[]>;
    private getProductionData;
    private getTestData;
    private getDevelopmentData;
    seed(options?: any): Promise<number>;
}
//# sourceMappingURL=video-seeder.d.ts.map