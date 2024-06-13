const Tour = require('./../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')

// middleware for the short name for the multiple query values
exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

// get all the tours
exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()

    const tours = await features.query

    // send response
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours,
      },
    })
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error.message,
    })
  }
}

// get a tour
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)

    res.status(200).json({
      status: 'success',
      data: { tour },
    })
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error,
    })
  }
}

// create tour
exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 'failed',
      message: 'Invalid data sent!',
    })
  }
}

// updateTour
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      status: 'seccess',
      data: { tour },
    })
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: 'Update Failed!',
    })
  }
}

// delete tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: 'seccess',
      data: null,
    })
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error,
    })
  }
}
