const Tour = require('./../models/tourModel')

// get all the tours
exports.getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find()

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
      message: error,
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
    res.status(400).json({
      status: 'failed',
      message: 'Update Failed!',
    })
  }
}

// delete tour
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'seccess',
    data: null,
  })
}
