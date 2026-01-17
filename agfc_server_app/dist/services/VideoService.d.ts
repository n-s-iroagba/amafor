declare class VideoService {
    private videoRepository;
    constructor();
    getAllVideos(page?: number, limit?: number): Promise<any>;
    getVideoById(id: number): Promise<any>;
    createVideo(videoData: any): Promise<any>;
    updateVideo(id: number, videoData: any): Promise<any>;
    deleteVideo(id: number): Promise<any>;
}
export default VideoService;
//# sourceMappingURL=VideoService.d.ts.map