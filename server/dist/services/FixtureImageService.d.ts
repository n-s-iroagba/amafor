import FixtureImage, { FixtureImageCreationAttributes } from '../models/FixtureImage';
export declare class FixtureImageService {
    private fixtureImageRepository;
    private fixtureRepository;
    constructor();
    createFixtureImage(imageData: FixtureImageCreationAttributes[]): Promise<FixtureImage[]>;
    getFixtureImageById(id: string): Promise<FixtureImage>;
    getFixtureImagesByFixture(fixtureId: string): Promise<FixtureImage[]>;
    updateFixtureImage(id: string, imageData: Partial<FixtureImage>): Promise<FixtureImage>;
    deleteFixtureImage(id: string): Promise<void>;
}
//# sourceMappingURL=FixtureImageService.d.ts.map