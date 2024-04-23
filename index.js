const express = require('express');
const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')

const authRoutes = require('./routes/authRoutes');

const {requireAuth, checkUser} = require('./middlewares/authMiddlewares')

const mongoose = require('mongoose');

const app = express();

// bodyParser should be used before initializing routes
// Parse incoming request bodies
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use(cookieParser());

app.use(express.json()); // must be used before initializing routes


app.use(express.static('public'));

app.set('view engine','ejs');



const dbURI = "mongodb://localhost:27017/travelapp";

mongoose.connect(dbURI, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    // useCreateIndex:true
})
.then((result) =>{
    app.listen(5000, ()=>{
        console.log("App is listening on port 5000")
    })
})
.catch( (err)=>{
    console.log(err)
})



 
app.get('*',checkUser )

app.get('/',(req, res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, "secret",(err, decodedToken) =>{
            if(err){
                res.redirect('/login')
            }else{
                res.redirect('/dashboard')
            }
        })
    }else{
        res.redirect('/login')
    }
});

app.get("/dashboard", requireAuth,(req, res)=>{
    res.render('dashboard')
});

app.use(authRoutes);
// "user is not defined" error on login signup route when addded header to them which uses user variable ?
// because, app.use(authRoutes); is not after teh routes in index page