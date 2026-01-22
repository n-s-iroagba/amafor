import { Response } from 'express';
export interface ApiResponseOptions {
    message?: string;
    data?: any;
    errors?: any;
    statusCode?: number;
}
export declare class ApiResponse {
    static success(res: Response, options?: ApiResponseOptions): void;
    static error(res: Response, options?: ApiResponseOptions): void;
    static paginated(res: Response, data: any[], total: number, page: number, limit: number, message?: string): void;
}
//# sourceMappingURL=apiResponse.d.ts.map