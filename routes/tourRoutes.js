const express = require('express')
const tourController = require('./../controllers/tourController')

const router = express.Router()

// router.param('id', tourController.checkId);

// routes for /api/v1/tours

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTour, tourController.getAllTours)

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour)

// routes for /api/v1/tours/:id
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour)

module.exports = router
