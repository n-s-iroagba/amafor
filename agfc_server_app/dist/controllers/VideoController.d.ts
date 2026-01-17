import { Request, Response } from 'express';
export declare class VideoController {
    static getUploadSignature(req: Request, res: Response): Promise<void>;
    /**
     * Get all videos with pagination
     */
    static getAllVideos(req: Request, res: Response): Promise<any>;
    /**
     * Get single video by ID
     */
    static getVideoById(req: Request, res: Response): Promise<any>;
    /**
     * Create new video
     */
    static createVideo(req: Request, res: Response): Promise<any>;
    /**
     * Update video by ID
     */
    static updateVideo(req: Request, res: Response): Promise<any>;
    /**
     * Delete video by ID
     */
    static deleteVideo(req: Request, res: Response): Promise<any>;
    /**
     * Search videos by title or excerpt
     */
    static searchVideos(req: Request, res: Response): Promise<any>;
    /**
     * Get videos with duration filter
     */
    static getVideosByDuration(req: Request, res: Response): Promise<any>;
}
declare const _default: VideoController;
export default _default;
//# sourceMappingURL=VideoController.d.ts.map