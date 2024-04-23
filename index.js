// ******************* modules ***********************
const express  = require("express")
const mongoose  = require("mongoose")
const jwt  = require("jsonwebtoken")
const cookieParser  = require("cookie-parser")
const authRoutes = require("./routes/authRoutes")
const {requireAuth, checkUser} = require('./middlewares/authMiddleware')





// **************** Initializing express *****************
const app = express()


app.use(cookieParser())
app.use(express.json())


app.use(express.static('public'))
app.set("view engine", "ejs")


// ******************** db connection ************************
const dbURI = "mongodb://localhost:27017/crm";
mongoose.connect(dbURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then((result) =>{
    app.listen(3000, ()=>{
        console.log("CRM is running on port 3000");
    })
})
.catch( (err)=>{
    console.log(err);
})

app.get('*',checkUser )

// ***************** requests ********************************
app.get("/", (req, res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, "secret",(err, decodedToken) =>{
            if(err){
                res.redirect('/signin')
            }else{
                res.redirect('/dashboard1')
            }
        })
    }else{
        res.redirect('/signin')
    }
})


app.get("/dashboard1",requireAuth, (req, res)=>{
    res.render("dashboard1")
})





app.use(authRoutes)