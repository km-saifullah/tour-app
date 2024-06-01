const fs = require('fs');

// read the tours data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// check id
exports.checkId = (req, res, next, val) => {
  console.log(`The tour id is:${val}`);
  if (Number(req.params.id) > tours.length) {
    return res.status(404).json({
      status: 'failed',
      message: 'Invalid ID',
    });
  }
  next();
};

//
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'faile',
      message: 'Missing and or price',
    });
  }
  next();
};

// get all the tours
exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: { tours },
  });
};

// get a tour
exports.getTour = (req, res) => {
  const id = Number(req.params.id);
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours: tour },
  });
};

// create tour
exports.createTour = (req, res) => {
  //   console.log(req.body);
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: { tours: newTour },
      });
    }
  );
};

// updateTour
exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'seccess',
    data: {
      tour: '<Updated Tour Here..>',
    },
  });
};

// delete tour
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'seccess',
    data: null,
  });
};
