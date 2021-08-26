'use strict';
var mongoose = require('mongoose');
var app = require('./app');
var port = 3800;
// Connection to the database
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/mean_red_social', { useMongoClient: true })
    .then(() => {
    console.log('Connection to the database success');
    // Creating server
    app.listen(port, () => {
        console.log('server running at http://localhost:3800');
    });
})
    .catch((err) => console.log(err));
