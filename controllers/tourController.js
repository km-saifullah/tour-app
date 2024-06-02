const Tour = require('./../models/tourModel')

// get all the tours
exports.getAllTours = (req, res) => {
  // res.status(200).json({
  //   status: 'success',
  //   requestedAt: req.requestTime,
  //   results: tours.length,
  //   data: { tours },
  // })
}

// get a tour
exports.getTour = (req, res) => {
  const id = Number(req.params.id)
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
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'seccess',
    // data: {
    //   tour: '<Updated Tour Here..>',
    // },
  })
}

// delete tour
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'seccess',
    data: null,
  })
}
