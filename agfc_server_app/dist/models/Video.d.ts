import { Model, Optional, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
export interface VideoAttributes {
    id: number;
    title: string;
    excerpt: string;
    thumbnail: string;
    videoUrl: string;
    duration?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface VideoCreationAttributes extends Optional<VideoAttributes, 'id' | 'createdAt' | 'updatedAt'> {
}
declare class Video extends Model<InferAttributes<Video>, InferCreationAttributes<Video>> implements VideoAttributes {
    id: CreationOptional<number>;
    title: string;
    excerpt: string;
    thumbnail: string;
    videoUrl: string;
    duration: CreationOptional<number>;
    createdAt: CreationOptional<Date>;
    updatedAt: CreationOptional<Date>;
}
export default Video;
//# sourceMappingURL=Video.d.ts.map