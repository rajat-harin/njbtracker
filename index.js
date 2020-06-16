//IMPORTS
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const qrcode = require('qrcode');

const {ensureAuthenticated} = require('./config/auth');

//app declaration
const app = express();

//passport config
require('./config/passport')(passport);

mongoose.connect('mongodb://localhost:27017/Sih',
    {
     useUnifiedTopology: true,
     useNewUrlParser: true 
    },
    (err)=>{
    if(err){
        console.log('Error connecting to database');
    }
    else{
        console.log('success Connected');
        
    }
});



//middlewares
app.use(express.urlencoded({
    extended : true
}));

app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//express session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
//passport 
app.use(passport.initialize());
app.use(passport.session());
//connect flash

app.use(flash());

//global vars

app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Static Folder
app.use(express.static(path.join(__dirname,'public')));



//ROUTES
const imgStoreRoute = require('./Routes/imgStore');
const hashRoute = require('./Routes/hash');
const tripRoute = require('./Routes/trip');
const loginRoute = require('./Routes/login');
const signupRoute = require('./Routes/signup');
const qrcodeRoute = require('./Routes/qrcode');
const dashBoardRoute = require('./Routes/dashboard');





app.use('/api/imgStore', imgStoreRoute);
app.use('/api/hash', hashRoute);
app.use('/register', tripRoute);
app.use('/login', loginRoute);
app.use('/signup', signupRoute);
app.use('/qrcode', qrcodeRoute);
app.use('/dashboard', dashBoardRoute);


app.post('/', (req, res) => {
    res.send(req.body);
});
app.get('/', (req, res) => {
    res.render('home', {layout: 'landing'});
    
});

//SERVER LISTEN

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`listening on port ${PORT}...`);
});