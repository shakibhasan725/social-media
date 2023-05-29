// auth riderict

const validate = require("../Utility/validate");




const authRedirect = (req, res, next)=>{

    const token = req.cookies.authToken ; 


    if(token){
        validate('', '/', req, res)
    }else{
        next();
    }
}


module.exports = authRedirect