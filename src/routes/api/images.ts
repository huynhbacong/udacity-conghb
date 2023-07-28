import express, { NextFunction } from "express";
import imagesService from "../../services/imagesService";
import logger from "../utilities/logger";
import logError from "../utilities/logError";

const images = express.Router();

export interface ImageInfo {
    filename?: string;
    width?: string;
    height?: string;
}

const imageRoute = () : express.Router => {
    images.get('/', logger, async (req : express.Request, res : express.Response, next : NextFunction) : Promise<void> => {
        if(req.query.width != null && isNaN(Number(req.query.width))) {
            throw new Error("Width must be a number.");
        };

        if(req.query.height != null && isNaN(Number(req.query.height))) {
            throw new Error("Height must be a number.");
        };

        const param : ImageInfo = {
            filename: req.query.filename?.toString(),
            width: req.query.width?.toString(),
            height: req.query.height?.toString()
        };

        try {
            const imagePath = await imagesService(param);
            if (imagePath) {
                //Send file to display image to api.
                res.sendFile(imagePath, {root: './'});
            }
        } catch (ex :Error | any) {
            logError(ex,req.url);
            next(ex);
        }
    });

    return images;
}

export default imageRoute;