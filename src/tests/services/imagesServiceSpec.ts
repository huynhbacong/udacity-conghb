
import fs from 'fs';
import path from 'path';
import imagesService from '../../services/imagesService'; // Assuming the service is exported from imagesService.ts

const storagePath = 'storage';
describe('Images Service', () => {
  const testImageFolderPath = path.join(storagePath, 'images');
  const testThumbFolderPath = path.join(storagePath, 'thumb');
  const testImageFileName = 'test_image';
  const testThumbFileName = 'test_image_thumb';
  const testImageFileExtension = '.jpg';
  const testImageFilePath = path.join(testImageFolderPath, testImageFileName + testImageFileExtension);
  const testThumbFilePath = path.join(testThumbFolderPath, testThumbFileName + testImageFileExtension);

  beforeAll(() => {
    // Create test folders if they don't exist
    if (!fs.existsSync(testImageFolderPath)) {
      fs.mkdirSync(testImageFolderPath);
    }
    if (!fs.existsSync(testThumbFolderPath)) {
      fs.mkdirSync(testThumbFolderPath);
    }

    // Create a test image and test thumbnail image if they don't exist
    if (!fs.existsSync(testImageFilePath)) {
      // You may copy an existing test image or create one for testing
      fs.writeFileSync(testImageFilePath, fs.readFileSync('storage/images/testImage.jpg'));
    }
    if (!fs.existsSync(testThumbFilePath)) {
      // You may copy an existing test thumbnail image or create one for testing
      fs.writeFileSync(testThumbFilePath, fs.readFileSync('storage/images/testImage.jpg'));
    }
  });

  afterAll(() => {
    // Clean up the test images and thumbnails after testing
    if (fs.existsSync(testImageFilePath)) {
      fs.unlinkSync(testImageFilePath);
    }
    
    if (fs.existsSync(testThumbFolderPath)) {
      const files = fs.readdirSync(testThumbFolderPath);
      files.map(file => {
        fs.unlinkSync(path.join(testThumbFolderPath, file));
      })
    }
  });

  // Test the imagesService function
  describe('imagesService', () => {
    it('should return a valid thumbnail image path for an thumb existing image with resize data', async () => {
      const query = { filename: testImageFileName, width: '100', height: '100' };
      const result = await imagesService(query);
      expect(result).toBe(testThumbFilePath);
    });

    it('should return a valid thumbnail image path for an thumb existing image with original data', async () => {
        const query = { filename: testImageFileName, width: '1920', height: '1273' };
        const result = await imagesService(query);
        
        expect(result).toBe(testThumbFilePath);
    });

    it('should return a valid thumbnail image path for not existing image in thumb but images folder', async () => {
        if (fs.existsSync(testThumbFilePath)) {
            fs.unlinkSync(testThumbFilePath);
        };

        const query = { filename: testImageFileName, width: '100', height: '100' };
        const result = await imagesService(query);

        const isExistThumbImage = fs.existsSync(testThumbFilePath);
        expect(isExistThumbImage).toBeTrue();
        expect(result).toBe(testThumbFilePath);
    });

    it('should throw an error for a non-existing image', async () => {
      const query = { filename: 'non_existing_image', width: '100', height: '100' };
      await expectAsync(imagesService(query)).toBeRejectedWithError('File name does not exist.');
    });
  });
});