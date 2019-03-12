import express from 'express';
import HomeController from '../controllers/Home.controller';
import LocationMiddleware from '../middlewares/Location.middleware';
import LocationController from '../controllers/Location.controller';

const router = express.Router();

router.get('/home', HomeController.welcomeMessage);

// get endpoints
router.get('/locations', LocationController.get)

//create endpoint

router.post('/locations/apex', LocationMiddleware.checkCreateApexLocationReqBody, LocationController.createApexLocationAndSubLocation)
router.post('/locations/sub', LocationMiddleware.checkCreateSublocationReqBody, LocationController.createSublocation)
router.post('/locations', LocationMiddleware.checkLocationReqBody, LocationController.createLocation)


//update endpoints
router.put('/locations/:id', LocationMiddleware.checkLocationReqBody, LocationController.updateLocation)
router.put('/locations/apex/:id', LocationController.updateApexLocation)
router.put('/locations/apex/:parentId/sub/:id', LocationMiddleware.checkUpdateSublocationReqBody, LocationController.updateSubLocations)

//delete endpoints

router.delete('/locations/:id', LocationController.deleteLocation)
router.delete('/locations/apex/:parentId/sub/:id', LocationController.deleteSubLocation)


export default router;
