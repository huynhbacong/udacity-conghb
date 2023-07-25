import express from "express";

const logError = (req: express.Request, res: express.Response, next: Function): void => {
    let url = req.url;
    console.log(`${url} has error: ${res.errored}.`);
    next();
}

export default logError;