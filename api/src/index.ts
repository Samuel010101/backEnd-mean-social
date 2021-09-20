'use strict';

var mongoose = require('mongoose');
var app = require('./app');
var PORT = process.env.PORT || 3800;

// Connection to the database
mongoose.Promise = global.Promise;
mongoose
  .connect(
    'mongodb://localhost:27017/mean_red_social',
    { useMongoClient: true },
    { useNewUrlParser: true }
    // { useFindAndModify: false }
  )
  .then(() => {
    console.log('Connection to the database success');

    // Creating server
    app.listen(PORT, () => {
      console.log('server running at http://localhost:3800');
    });
  })
  .catch((err: any) => console.log(err));
