const express = require('express');
const mongoose = require('mongoose');
const config = require('config');

const app = express();

// bodyparser
app.use(express.json());

// db config
const db = config.get('mongoURI');
// for online: "mongoURI": "mongodb+srv://maximylius:maexiunmillion@blocktext-pvs0k.mongodb.net/test?retryWrites=true&w=majority",

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => console.log('MongoDB Connected :) ...'))
  .catch(err => console.log('Connection ERROR: ', err));

// use routes
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/notebooks', require('./routes/api/notebooks'));
app.use('/api/texts', require('./routes/api/texts'));
app.use('/api/sections', require('./routes/api/sections'));
app.use('/api/annotations', require('./routes/api/annotations'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port} :) ...`));
