import { Request, Response } from 'express';
export declare class VideoController {
    static getUploadSignature(req: Request, res: Response): Promise<void>;
    /**
     * List videos
     * @api GET /videos
     * @apiName API-VIDEO-002
     * @apiGroup Videos
     * @srsRequirement REQ-CMS-03, REQ-SCT-05
     */
    static getAllVideos(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Upload video
     * @api POST /videos
     * @apiName API-VIDEO-001
     * @apiGroup Videos
     * @srsRequirement REQ-CMS-03, REQ-SCT-05
     */
    static createVideo(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Update video metadata
     * @api PUT /videos/:id
     * @apiName API-VIDEO-004
     * @apiGroup Videos
     * @srsRequirement REQ-CMS-03
     */
    static updateVideo(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Delete video
     * @api DELETE /videos/:id
     * @apiName API-VIDEO-005
     * @apiGroup Videos
     * @srsRequirement REQ-CMS-03
     */
    static deleteVideo(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
declare const _default: VideoController;
export default _default;
//# sourceMappingURL=VideoController.d.ts.map