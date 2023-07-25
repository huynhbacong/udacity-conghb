"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const images_1 = __importDefault(require("./api/images"));
const logger_1 = __importDefault(require("./utilities/logger"));
const logError_1 = __importDefault(require("./utilities/logError"));
const routes = express_1.default.Router();
routes.get('/', logger_1.default, logError_1.default, (req, res) => {
    res.send('api connected!');
});
routes.use('/images', images_1.default);
exports.default = routes;
//# sourceMappingURL=routes.js.map