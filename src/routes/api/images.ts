import express from "express";
import imagesService from "../../services/imagesService";

const images = express.Router();

export interface ImageInfo {
    filename?: string;
    width?: string;
    height?: string;
}

const imageRoute = () : express.Router => {
    images.get('/', async (req : express.Request, res : express.Response) : Promise<void> => {
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
        
        const imagePath = await imagesService(param);
        
        if (imagePath) {
            //Send file to display image to api.
            res.sendFile(imagePath, {root: './'});
        }
    });

    return images;
}

export default imageRoute;