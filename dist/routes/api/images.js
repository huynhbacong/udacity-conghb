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
const express_1 = __importDefault(require("express"));
const imagesService_1 = __importDefault(require("../../services/imagesService"));
const images = express_1.default.Router();
const imageRoute = () => {
    images.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        if (req.query.width != null && isNaN(Number(req.query.width))) {
            throw new Error("Width must be a number.");
        }
        ;
        if (req.query.height != null && isNaN(Number(req.query.height))) {
            throw new Error("Height must be a number.");
        }
        ;
        const param = {
            filename: (_a = req.query.filename) === null || _a === void 0 ? void 0 : _a.toString(),
            width: (_b = req.query.width) === null || _b === void 0 ? void 0 : _b.toString(),
            height: (_c = req.query.height) === null || _c === void 0 ? void 0 : _c.toString()
        };
        const imagePath = yield (0, imagesService_1.default)(param);
        if (imagePath) {
            //Send file to display image to api.
            res.sendFile(imagePath, { root: './' });
        }
    }));
    return images;
};
exports.default = imageRoute;
//# sourceMappingURL=images.js.map