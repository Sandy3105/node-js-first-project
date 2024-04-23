const User = require("../models/User")
const jwt  = require("jsonwebtoken")


// creating jwt
const maxAge = 2*24*60*60*1000;
const createToken = (id)=>{
    return jwt.sign({id},'secret',{
        expiresIn:maxAge
    })
}


// ***************** Errors *********************
const handleErrors = (err)=>{
    // console.log(err.message,err.code);

    let errors = {
        email:"",
        password:""
    }

    if(err.message === "incorrect email"){
        errors.email = "That email is not registered";
    }

    if(err.message === "incorrect password"){
        errors.email = "That password is not correct";
    }

    if(err.code === 11000){
        errors.email = "That email is duplicate";
        return errors;
    }

    if(err.message.includes("user validation failed")){
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        });
    }
    return errors;

}


module.exports.signin_get = (req, res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, "secret",(err, decodedToken) =>{
            if(err){
                res.render('signin')
            }else{
                res.redirect('/dashboard1')
            }
        })
    }else{
        res.render('signin')
    }
    // res.render('login')
}

module.exports.signin_post = async (req, res)=>{
    const {email, password} = req.body
    // console.log(email,password);

    try{
        const user = await User.login(
            email,password
        )

        const token = createToken(user._id)
        res.cookie('jwt', token, {httpOnly:true, maxAge:maxAge})
        // res.cookie('jwt', token, {httpSecure:true})        
        res.status(200).json({user:user});
    }catch(err){
        // console.log(err);
        const errors = handleErrors(err)
        console.log(errors);
        res.status(400).json({errors})
    }
}



module.exports.signup_get = (req, res)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token, "secret", (err, decodedToken)=>{
            if(err){
                res.render("signup")
            }else{
                res.redirect("/dashboard1")
            }
        })
    }else{

        res.render('signup')
    }
}

module.exports.signup_post = async (req, res)=>{
    const {name, email, password} = req.body;

    try{
        const user = await User.create({
            name, email, password
        })

        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly:true, maxAge:maxAge});
        res.status(200).json({user:user._id});
    }catch(err){
        console.log(err);
        const errors = handleErrors(err)
        res.status(400).json({errors})

    }
}



module.exports.logout = async (req, res)=>{
    res.cookie("jwt",'',{ maxAge:1})
    res.redirect('/')
}