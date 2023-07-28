require('dotenv').config();
const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('express-flash');
const MongoDbStore = require('connect-mongo')(session);

// Database connection using Mongoose
const dbUrl = 'mongodb://127.0.0.1:27017/pizza'; // Replace 'pizza' with your actual database name
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected successfully to MongoDB server');
});

// app.use(session({
//   secret:process.env.COOKIE_SECRET,
//   store:MongoDbStore.create('sessions')
// }))
let mongoStore = new MongoDbStore({
  mongooseConnection: db,
  collection:'sessions'
})
// session config
 app.use(session({
     secret: process.env.COOKIE_SECRET,
     resave: false,
     store: mongoStore,
     saveUninitialized: false,
     cookie:{maxAge:  1000 * 60 * 60 * 24 } //24 hours  
 }));

app.use(flash())

//Assets
app.use(express.static('public'));
app.use(express.json());

//Global middleware
app.use((req,res,next)=>{
  res.locals.session = req.session
  next()
})
// set template engine
app.use(expressLayouts);
app.set('views', path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

require('./routes/web')(app);

app.listen(PORT, () => {
  console.log(`listening on PORT ${PORT}`);
});
