const mongoose = require('mongoose')
const slugify = require('slugify')

const toursSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have  a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

toursSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7
})

// document middleware: only runs before the .save() and .create() command
toursSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true })
  next()
})

// toursSchema.pre('save', function (next) {
//   console.log('Will save the doc')
//   next()
// })

// toursSchema.post('save', function (doc, next) {
//   console.log(doc)
//   next()
// })

// query middleware
// toursSchema.pre('find', function (next) {
toursSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } })
  this.start = Date.now()
  next()
})

toursSchema.post(/^find/, function (docs, next) {
  console.log(`Query Took ${Date.now() - this.start} miliseconds`)
  // console.log(docs)
  next()
})

// aggregation middleware
toursSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } })
  // console.log(this.pipeline())
  next()
})

const Tour = mongoose.model('Tour', toursSchema)

module.exports = Tour
