import MatchImage, { MatchImageCreationAttributes } from '../models/MatchImage';
export declare class MatchImageService {
    private matchImageRepository;
    private fixtureRepository;
    constructor();
    createMatchImage(imageData: MatchImageCreationAttributes[]): Promise<MatchImage[]>;
    getMatchImageById(id: number): Promise<MatchImage>;
    getMatchImagesByFixture(fixtureId: number): Promise<MatchImage[]>;
    updateMatchImage(id: number, imageData: Partial<MatchImage>): Promise<MatchImage>;
    deleteMatchImage(id: number): Promise<void>;
}
//# sourceMappingURL=MatchImageService.d.ts.map