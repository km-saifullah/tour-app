const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

// database url
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// database connection
mongoose.connect(DB).then(() => console.log('DB Connection Successful!'));

const port = process.env.PORT || 8000;

app.listen(port, '127.0.0.1', () => {
  console.log(`App running on port:${port}`);
});
