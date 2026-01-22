declare class VideoService {
    private videoRepository;
    constructor();
    getAllVideos(page?: number, limit?: number): Promise<import("../repositories/BaseRepository").PaginatedResult<import("../models/Video").default>>;
    createVideo(videoData: any): Promise<import("../models/Video").default>;
    updateVideo(id: string, videoData: any): Promise<import("../models/Video").default>;
    deleteVideo(id: string): Promise<number>;
}
export default VideoService;
//# sourceMappingURL=VideoService.d.ts.map