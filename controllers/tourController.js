const Tour = require('./../models/tourModel')

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing and or price',
    })
  }
  next()
}

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
exports.createTour = (req, res) => {
  //   console.log(req.body);
  res.status(201).json({
    status: 'success',
    // data: { tours: newTour },
  })
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
