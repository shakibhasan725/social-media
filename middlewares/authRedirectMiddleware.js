// auth riderict

const validate = require("../Utility/validate");
const jwt = require('jsonwebtoken');
const user = require('../models/user');


const authRedirect = async(req, res, next)=>{

    const token = req.cookies.authToken ; 


    try {
        if(token){
            

            const tokenCheck = jwt.verify(token, process.env.JWT_SECRET);

            if(tokenCheck){
                const verifyUser = await user.findById(tokenCheck.id);

                if(verifyUser){
                    next();
                }else{
                    delete req.session.user,
                     res.clearCookie('authToken');
                     validate('Token User Not found', '/login', req, res)
                }
            }
        }else{
            validate('You are not allowed', '/login', req, res)
        }
    } catch (error) {
        delete req.session.user,
        res.clearCookie('authToken');
        validate('Invalid Token', '/login', req, res)
    }
}


module.exports = authRedirect