import express from "express";
import images from "./api/images";
import logger from "./utilities/logger";
import logError from "./utilities/logError";

const routes = express.Router();

routes.get('/', logger, logError, (req, res) => {
    res.send('api connected!');
});

routes.use('/images', images);

export default routes;