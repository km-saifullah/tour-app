const Tour = require('./../models/tourModel')

// get all the tours
exports.getAllTours = async (req, res) => {
  try {
    // build query
    // 1)basic filtering
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach((element) => delete queryObj[element])
    console.log(req.query, queryObj)

    // 2) advance filtering
    // {difficulty:"easy",duration:{$gte:5}}
    let queryString = JSON.stringify(queryObj)
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    )
    // console.log(JSON.parse(queryString))

    // const query = Tour.find(queryObj)
    let query = Tour.find(JSON.parse(queryString))

    // 3) sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      // query = query.sort(req.query.sort)
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    // 4) field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields) // projecting
    } else {
      query = query.select('-__v')
    }

    // const tours = await Tour.find({
    //   duration: 5,
    //   difficulty: 'easy',
    // })
    // const tours = await Tour.find()
    //   .where('duration')
    //   .equals(5)
    //   .where('difficulty')
    //   .equals('easy')

    // executet he query
    const tours = await query

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
