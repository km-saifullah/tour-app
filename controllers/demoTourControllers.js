const fs = require('fs')
const Tour = require('./../models/tourModel')

// read the tours data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
)

// check id
exports.checkId = (req, res, next, val) => {
  console.log(`The tour id is:${val}`)
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID',
    })
  }
  next()
}

//
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
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  })
}

// get a tour
exports.getTour = async (req, res) => {
  const id = Number(req.params.id)
  const tour = tours.find((el) => el.id === id)

  try {
    // build query
    // 1)basic filtering
    // const queryObj = { ...req.query }
    const queryObj = { ...this.queryString }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach((element) => delete queryObj[element])
    console.log(req.query, queryObj)

    // 2) advance filtering
    // {difficulty:"easy",duration:{$gte:5}}
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    // console.log(JSON.parse(queryString))

    // const query = Tour.find(queryObj)
    let query = Tour.find(JSON.parse(queryStr))

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

    // 5) pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 100
    const skip = (page - 1) * limit
    query = query.skip(skip).limit(limit)

    if (req.query.page) {
      const numTours = await Tour.countDocuments()
      if (skip > numTours) throw new Error('The page does not exist')
    }

    // execute the query
    const features = new APIFeatures(Tour.find(), req.query).filter()
    // const tours = await query
    const tours = await features.query

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours: tour },
    })
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: error.message,
    })
  }
}

// create tour
exports.createTour = (req, res) => {
  //   console.log(req.body);
  const newId = tours[tours.length - 1].id + 1
  const newTour = Object.assign({ id: newId }, req.body)

  tours.push(newTour)

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: { tours: newTour },
      })
    }
  )
}

// updateTour
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'seccess',
    data: {
      tour: '<Updated Tour Here..>',
    },
  })
}

// delete tour
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'seccess',
    data: null,
  })
}
