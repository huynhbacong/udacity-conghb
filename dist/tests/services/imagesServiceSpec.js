"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const imagesService_1 = __importDefault(require("../../services/imagesService")); // Assuming the service is exported from imagesService.ts
const storagePath = 'storage';
describe('Images Service', () => {
    const testImageFolderPath = path_1.default.join(storagePath, 'images');
    const testThumbFolderPath = path_1.default.join(storagePath, 'thumb');
    const testImageFileName = 'test_image';
    const testThumbFileName = 'test_image_thumb';
    const testImageFileExtension = '.jpg';
    const testImageFilePath = path_1.default.join(testImageFolderPath, testImageFileName + testImageFileExtension);
    const testThumbFilePath = path_1.default.join(testThumbFolderPath, testThumbFileName + testImageFileExtension);
    beforeAll(() => {
        // Create test folders if they don't exist
        if (!fs_1.default.existsSync(testImageFolderPath)) {
            fs_1.default.mkdirSync(testImageFolderPath);
        }
        if (!fs_1.default.existsSync(testThumbFolderPath)) {
            fs_1.default.mkdirSync(testThumbFolderPath);
        }
        // Create a test image and test thumbnail image if they don't exist
        if (!fs_1.default.existsSync(testImageFilePath)) {
            // You may copy an existing test image or create one for testing
            fs_1.default.writeFileSync(testImageFilePath, fs_1.default.readFileSync('storage/images/testImage.jpg'));
        }
        if (!fs_1.default.existsSync(testThumbFilePath)) {
            // You may copy an existing test thumbnail image or create one for testing
            fs_1.default.writeFileSync(testThumbFilePath, fs_1.default.readFileSync('storage/images/testImage.jpg'));
        }
    });
    afterAll(() => {
        // Clean up the test images and thumbnails after testing
        if (fs_1.default.existsSync(testImageFilePath)) {
            fs_1.default.unlinkSync(testImageFilePath);
        }
        if (fs_1.default.existsSync(testThumbFolderPath)) {
            const files = fs_1.default.readdirSync(testThumbFolderPath);
            files.map(file => {
                fs_1.default.unlinkSync(path_1.default.join(testThumbFolderPath, file));
            });
        }
    });
    // Test the imagesService function
    describe('imagesService', () => {
        it('should return a valid thumbnail image path for an thumb existing image with resize data', () => __awaiter(void 0, void 0, void 0, function* () {
            const query = { filename: testImageFileName, width: '100', height: '100' };
            const result = yield (0, imagesService_1.default)(query);
            expect(result).toBe(testThumbFilePath);
        }));
        it('should return a valid thumbnail image path for an thumb existing image with original data', () => __awaiter(void 0, void 0, void 0, function* () {
            const query = { filename: testImageFileName, width: '1920', height: '1273' };
            const result = yield (0, imagesService_1.default)(query);
            expect(result).toBe(testThumbFilePath);
        }));
        it('should return a valid thumbnail image path for not existing image in thumb but images folder', () => __awaiter(void 0, void 0, void 0, function* () {
            if (fs_1.default.existsSync(testThumbFilePath)) {
                fs_1.default.unlinkSync(testThumbFilePath);
            }
            ;
            const query = { filename: testImageFileName, width: '100', height: '100' };
            const result = yield (0, imagesService_1.default)(query);
            const isExistThumbImage = fs_1.default.existsSync(testThumbFilePath);
            expect(isExistThumbImage).toBeTrue();
            expect(result).toBe(testThumbFilePath);
        }));
        it('should throw an error for a non-existing image', () => __awaiter(void 0, void 0, void 0, function* () {
            const query = { filename: 'non_existing_image', width: '100', height: '100' };
            yield expectAsync((0, imagesService_1.default)(query)).toBeRejectedWithError('File name does not exist.');
        }));
    });
});
//# sourceMappingURL=imagesServiceSpec.js.map