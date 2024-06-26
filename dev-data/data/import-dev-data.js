const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('../../models/tourModel')

dotenv.config({ path: './config.env' })

// database url
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
)

// database connection
mongoose.connect(DB).then(() => console.log('DB Connection Successful!'))

// read json file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
)

// import data into db
const importData = async () => {
  try {
    await Tour.create(tours)
    console.log('Data successfully loaded')
  } catch (error) {
    console.log(error)
  }
  process.exit()
}

// delete all data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log('all data delete from db')
  } catch (error) {
    console.log(error)
  }
  process.exit()
}

if (process.argv[2] === '--import') {
  importData()
} else if (process.argv[2] === '--delete') {
  deleteData()
}

console.log(process.argv)
