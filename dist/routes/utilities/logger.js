"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = (req, res, next) => {
    let url = req.url;
    console.log(`${url} has visited.`);
    next();
};
exports.default = logger;
//# sourceMappingURL=logger.js.map