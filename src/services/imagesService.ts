import { ImageInfo } from "../routes/api/images";
import fs from "fs";
import path from "path";
import sharp from 'sharp';

const imageExtension = ".jpg";
const imagesFolderPath = "storage/images";
const thumbFolderPath = "storage/thumb";``
const thumb = '_thumb';
let _isAddNew = false;

export interface ImageDataParams {
  width: number,
  height: number
}

/**
 * Resolve images input service.
 * @param query A object includes image info.
 * @returns A promise that resolves a string or undefined.
 */
const imagesService = async (query : ImageInfo) : Promise<string | undefined> => {
  _isAddNew = false;
  const imageName : string = query.filename + imageExtension;
  const _thumbName : string = query.filename + thumb + imageExtension;

  const imagePath = path.join(imagesFolderPath, imageName);
  const thumbImagePath = path.join(thumbFolderPath, _thumbName);

  //Check if file name is exist
  if (!fs.existsSync(imagePath)) {
    throw new Error("File name does not exist.");
  }
  
  let image : Buffer = await sharp(imagePath).toBuffer();
  
  //Check if image already exist in thumb folder
  if (fs.existsSync(thumbImagePath)) {
    image = await thumbFolderHandler(query, thumbImagePath, imagePath, image);
  } else {
    _isAddNew = true;
    image = await imageFolderhandler(query, imagePath);
  }
  
  //Create new file to thumb folder
  if (_isAddNew) {
    await fs.promises.writeFile(thumbImagePath, image);
  }

  return new Promise<string>((resolve) => resolve(thumbImagePath));
}

/**
 * Handle logic to image is exist in thumb folder.
 * @param query A object includes image info.
 * @param thumbImagePath A path of thumb image.
 * @param ImagePath A path of origin image.
 * @param image A buffer of image file.
 * @returns A promise that resolves a buffer.
 */
const thumbFolderHandler = async (query : ImageInfo, thumbImagePath: string, imagePath: string, image : Buffer) : Promise<Buffer> => {
  const originImage : ImageDataParams = await getImageInfo(thumbImagePath);

  let width : string = originImage.width.toString();
  let height : string = originImage.height.toString();

  const isOriginMatched = query.width == width && query.height == height;

  if (!isOriginMatched) {
    _isAddNew = true;
    
    width = query.width ?? width;
    height = query.height ?? height;

    image  = await resize(imagePath, parseInt(width), parseInt(height));
  }

  return new Promise<Buffer>(resolve => resolve(image));
}

/**
 * Handle logic to image is exist in images folder.   
 * @param query A object includes image info.
 * @param imagePath A path of image.
 * @returns A promise that resolves a buffer.
 */
const imageFolderhandler = async (query : ImageInfo, imagePath : string) : Promise<Buffer> => {
  const originImage : ImageDataParams = await getImageInfo(imagePath);

  let width : string = query.width ?? originImage.width.toString();
  let height : string = query.height ?? originImage.height.toString();
  return await resize(imagePath, parseInt(width), parseInt(height));
}

/**
 * get info of a image file.
 * @param path A path of file to get data.
 * @returns A promise that resolves image data object.
 */
const getImageInfo = async (path : string) : Promise<ImageDataParams> => {
  const imageData = await sharp(path).metadata();

  return new Promise<ImageDataParams>((resolve) => resolve({
    width: imageData.width ?? 0,
    height: imageData.height ?? 0
  }));
}

/**
 * Resize a file.
 * @param path A path of file to resize.
 * @param width width of new file.
 * @param height height of new file.
 * @returns A promise that resolves a buffer object.
 */
const resize = async (path: string, width: number, height: number) : Promise<Buffer> => await sharp(path)
  .resize(width, height)
  .jpeg()
  .clone()
  .toBuffer()
  .catch( err => { 
    console.log(err);
    throw err;
  });

export default imagesService;