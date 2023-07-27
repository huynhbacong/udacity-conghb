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
const sharp_1 = __importDefault(require("sharp"));
const imageExtension = ".jpg";
const imagesFolderPath = "storage/images";
const thumbFolderPath = "storage/thumb";
``;
const thumb = '_thumb';
let _isAddNew = false;
/**
 * Resolve images input service.
 * @param query A object includes image info.
 * @returns A promise that resolves a string or undefined.
 */
const imagesService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    _isAddNew = false;
    const imageName = query.filename + imageExtension;
    const _thumbName = query.filename + thumb + imageExtension;
    const imagePath = path_1.default.join(imagesFolderPath, imageName);
    const thumbImagePath = path_1.default.join(thumbFolderPath, _thumbName);
    //Check if file name is exist
    if (!fs_1.default.existsSync(imagePath)) {
        throw new Error("File name does not exist.");
    }
    let image = yield (0, sharp_1.default)(imagePath).toBuffer();
    //Check if image already exist in thumb folder
    if (fs_1.default.existsSync(thumbImagePath)) {
        image = yield thumbFolderHandler(query, thumbImagePath, imagePath, image);
    }
    else {
        _isAddNew = true;
        image = yield imageFolderhandler(query, imagePath);
    }
    //Create new file to thumb folder
    if (_isAddNew) {
        yield fs_1.default.promises.writeFile(thumbImagePath, image);
    }
    return new Promise((resolve) => resolve(thumbImagePath));
});
/**
 * Handle logic to image is exist in thumb folder.
 * @param query A object includes image info.
 * @param thumbImagePath A path of thumb image.
 * @param ImagePath A path of origin image.
 * @param image A buffer of image file.
 * @returns A promise that resolves a buffer.
 */
const thumbFolderHandler = (query, thumbImagePath, imagePath, image) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const originImage = yield getImageInfo(thumbImagePath);
    let width = originImage.width.toString();
    let height = originImage.height.toString();
    const isOriginMatched = query.width == width && query.height == height;
    if (!isOriginMatched) {
        _isAddNew = true;
        width = (_a = query.width) !== null && _a !== void 0 ? _a : width;
        height = (_b = query.height) !== null && _b !== void 0 ? _b : height;
        image = yield resize(imagePath, parseInt(width), parseInt(height));
    }
    return new Promise(resolve => resolve(image));
});
/**
 * Handle logic to image is exist in images folder.
 * @param query A object includes image info.
 * @param imagePath A path of image.
 * @returns A promise that resolves a buffer.
 */
const imageFolderhandler = (query, imagePath) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const originImage = yield getImageInfo(imagePath);
    let width = (_c = query.width) !== null && _c !== void 0 ? _c : originImage.width.toString();
    let height = (_d = query.height) !== null && _d !== void 0 ? _d : originImage.height.toString();
    return yield resize(imagePath, parseInt(width), parseInt(height));
});
/**
 * get info of a image file.
 * @param path A path of file to get data.
 * @returns A promise that resolves image data object.
 */
const getImageInfo = (path) => __awaiter(void 0, void 0, void 0, function* () {
    const imageData = yield (0, sharp_1.default)(path).metadata();
    return new Promise((resolve) => {
        var _a, _b;
        return resolve({
            width: (_a = imageData.width) !== null && _a !== void 0 ? _a : 0,
            height: (_b = imageData.height) !== null && _b !== void 0 ? _b : 0
        });
    });
});
/**
 * Resize a file.
 * @param path A path of file to resize.
 * @param width width of new file.
 * @param height height of new file.
 * @returns A promise that resolves a buffer object.
 */
const resize = (path, width, height) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, sharp_1.default)(path)
        .resize(width, height)
        .jpeg()
        .clone()
        .toBuffer()
        .catch(err => {
        console.log(err);
        throw err;
    });
});
exports.default = imagesService;
//# sourceMappingURL=imagesService.js.map