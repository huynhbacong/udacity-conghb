import express from "express";
import imageRoute from "./api/images";

const routes = express.Router();

routes.get('/', (req : express.Request, res : express.Response) : void => {
    res.send('api connected!');
});

routes.use('/images', imageRoute());

export default routes;