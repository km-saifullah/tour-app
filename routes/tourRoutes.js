const express = require('express')
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController')

const router = express.Router()

// router.param('id', tourController.checkId);

// routes for /api/v1/tours

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTour, tourController.getAllTours)

router.route('/tour-stats').get(tourController.getTourStats)
router.route('/montly-plan/:year').get(tourController.getMontlyPlan)

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour)

// routes for /api/v1/tours/:id
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  )

module.exports = router
