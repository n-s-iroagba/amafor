export interface Video {
    id: number;
    title: string;
    excerpt: string;
    thumbnail: string;
    videoUrl: string;
    duration?: number;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
