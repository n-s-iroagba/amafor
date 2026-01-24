declare class VideoService {
    private videoRepository;
    constructor();
    getAllVideos(page?: number, limit?: number): Promise<import("../repositories/BaseRepository").PaginatedResult<import("../models").Video>>;
    createVideo(videoData: any): Promise<import("../models").Video>;
    updateVideo(id: string, videoData: any): Promise<import("../models").Video>;
    deleteVideo(id: string): Promise<number>;
}
export default VideoService;
//# sourceMappingURL=VideoService.d.ts.map