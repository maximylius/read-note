const express = require('express');
const mongoose = require('mongoose');
const config = require('config');
const path = require('path');

const app = express();

// bodyparser
app.use(express.json());

// db config
// if working offline: "mongoURI": "mongodb://127.0.0.1:27017/blocktext",
// if online:  "mongoURI": "mongodb+srv://maximylius:maexiunmillion@blocktext-pvs0k.mongodb.net/test?retryWrites=true&w=majority",
const db = config.get('mongoURI');

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
app.use('/api/notes', require('./routes/api/notes'));
app.use('/api/texts', require('./routes/api/texts'));
app.use('/api/sections', require('./routes/api/sections'));
app.use('/api/common', require('./routes/api/common'));

// serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port} :) ...`));
