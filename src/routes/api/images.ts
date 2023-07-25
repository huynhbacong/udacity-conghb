import express from "express";
import imagesService from "../../services/imagesService";

const images = express.Router();

export interface ImageInfo {
    filename?: string;
    width?: string;
    height?: string;
}

images.get('/', async (req, res) => {
    let param : ImageInfo = req.query; 
    const imagePath = await imagesService(param);
    
    if (imagePath) {
        //Send file to display image to api.
        res.sendFile(imagePath, {root: './'});
    }
});

export default images;