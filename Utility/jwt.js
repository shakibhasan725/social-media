// create  token
const jwt = require('jsonwebtoken');

const createToken = (payload, exp = 86400000 )=>{

    const token = jwt.sign( payload, process.env.JWT_SECRET, {
        expiresIn : exp
    });

    return token;
}




module.exports = createToken