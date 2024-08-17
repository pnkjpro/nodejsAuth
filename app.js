const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const session = require('express-session');
const passport = require('./config/passport');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const ensureAuthenticated = require('./middleware/authenticate');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up session middleware
app.use(session({
  secret: 'your_secret_key', 
  resave: false,
  saveUninitialized: false
}));

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());
 
// Sync database
sequelize.sync().then(() => {
  console.log('Database synced');
}).catch(err => {
  console.log('Error syncing database', err);
});
 
// Use routes
app.use(userRoutes);
app.use(authRoutes);
app.use('/auth', authRoutes); //added for forgot password and reset link

// Render create user form
app.get('/create-user', (req, res) => {
  res.render('createUser');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
