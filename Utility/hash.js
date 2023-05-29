//Make hash password
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const makeHash = (password)=>{

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    return hash; 
}




module.exports = makeHash