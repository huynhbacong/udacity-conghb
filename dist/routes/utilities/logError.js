"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logError = (req, res, next) => {
    let url = req.url;
    console.log(`${url} has error: ${res.errored}.`);
    next();
};
exports.default = logError;
//# sourceMappingURL=logError.js.map