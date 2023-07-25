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
const imagesService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    _isAddNew = false;
    const imageName = query.filename + imageExtension;
    const _thumbName = query.filename + thumb + imageExtension;
    let imagePath = path_1.default.join(imagesFolderPath, imageName);
    let thumbImagePath = path_1.default.join(thumbFolderPath, _thumbName);
    if (!fs_1.default.existsSync(imagePath)) {
        throw new Error("File name does not exist.");
    }
    let image = yield (0, sharp_1.default)(imagePath).toBuffer();
    if (fs_1.default.existsSync(thumbImagePath)) {
        image = yield thumbFolderHandler(query, thumbImagePath, image);
    }
    else {
        _isAddNew = true;
        image = yield imageFolderhandler(query, imagePath);
    }
    if (_isAddNew) {
        yield fs_1.default.promises.writeFile(thumbImagePath, image);
    }
    return new Promise((resolve) => resolve(thumbImagePath));
});
const thumbFolderHandler = (query, thumbImagePath, image) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const originImage = yield getImageInfo(thumbImagePath);
    let width = originImage.width.toString();
    let height = originImage.height.toString();
    const isOriginMatched = query.width == width && query.height == height;
    if (!isOriginMatched) {
        _isAddNew = true;
        width = (_a = query.width) !== null && _a !== void 0 ? _a : width;
        height = (_b = query.height) !== null && _b !== void 0 ? _b : height;
        image = yield resize(thumbImagePath, parseInt(width), parseInt(height));
    }
    return new Promise(resolve => resolve(image));
});
const imageFolderhandler = (query, imagePath) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const originImage = yield getImageInfo(imagePath);
    let width = (_c = query.width) !== null && _c !== void 0 ? _c : originImage.width.toString();
    let height = (_d = query.height) !== null && _d !== void 0 ? _d : originImage.height.toString();
    return yield resize(imagePath, parseInt(width), parseInt(height));
});
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