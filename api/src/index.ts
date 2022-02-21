'use strict';

// if (process.env.NODE_ENV == 'production') {
//   require('dotenv').config();
// }

import mongoose from 'mongoose';
import app from './app';
const PORT = process.env.PORT || 3800;

// Connection to the database
const conectionDB = async () => {
  try {
    const db = await mongoose.connect(
      'mongodb://localhost:27017/mean_red_social',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    const url = `${db.connection.host}, ${db.connection.port}`;
    console.log(`Connection to the database success ${url}`);
  } catch (err: any) {
    console.log(err.message);
  }
};
