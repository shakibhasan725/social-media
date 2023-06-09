const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const user = require('../models/user');
const makeHash = require('../Utility/hash');

const validate = require('../Utility/validate');
const createToken = require('../Utility/jwt');
const { verifyAccountMail } = require('../Utility/sendMail');
const session = require('express-session');


/**
 * Create a New User
 */

    const createAccount= async (req,res)=>{


        const{name, email, phone, password , username} = req.body;

    try {


        //Email Check 

        const isExsist = await user.find().where("email").equals(email);

        if(isExsist.length > 0){
            
            res.status(400).json({
            message: "Email Already exsist"
            })
        };



        if(isExsist.length == 0){
            
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password , salt);


        await user.create({name, email, phone, username , password : hash});

        res.status(200).json({

            message: `Dear ${name},Account Created Succesfully` 
        })

        }



        
        
    } catch (error) {

        res.status(400).json({
            message: error.message
        })
        
    }




    }

/**
 * 
 * Login User
 */

    const userLogin= async (req,res)=>{

        const {auth , password} = req.body;
    

        try {
            // User check
            const userLogin = await user.find().where('email').equals(auth);
            if(userLogin.length == 0){
                res.status(404).json({
                    message : "User not Found" 
                })
            }


            if(userLogin.length > 0){
                // Password check

            const userPassword = bcrypt.compareSync(password, userLogin[0].password);
            
            if(!userPassword){
                res.status(404).json({
                    message : "Password Not Matched" 
                })
            }

            // User Login

            if(userPassword){
                const token = jwt.sign({
                    id: userLogin[0]._id
                    
                }, process.env.JWT_SECRET ,{
                    expiresIn: "365d"
                });
                res.status(200).cookie('authToken', token).json({
                    message: 'Login Successfully',
                    token: token 
                })
            }
            }

        } catch (error) {
            res.status(400).json({
                message : error 
            })
        }



    }



/**
 * Get Logged in user
 */

    const loggedInUser = async(req,res)=>{
        try {
            
            //Get token from cookies

            const token = req.cookies.authToken;

            if(!token){
                res.status(400).json({
                    message: "You are not authorized"
                })
            };

            // Verify token

            const verify = jwt.verify(token , process.env.JWT_SECRET);

            if(verify){

                const verifiedUser = await user.findById(verify.id);

               
                res.status(200).json({
                    user: verifiedUser
                })
            }
            

        } catch (error) {
            res.status(400).json({
                message: error.message
            })
        }

    }




//User profile

const profilePage = (req , res)=>{

    res.render('profile')
}


//Login Page

const loginPage = async (req, res)=>{
    res.render('login')

}

//Register page

const registerPage = async(req,res)=>{
    res.render('register')

}

// Register usr


const registerUser = async (req, res)=>{
    
    try {
        const {name, username, email, phone ,password, gender} = req.body;

    //validation
        
            if(!name && !username && !email && !phone && !password && !gender){

                validate('All fields are required' , '/register' , req, res)
            }else{
                const emailCheck = await user.findOne().where('email').equals(email);
                const userNameCheck = await user.findOne().where('username').equals(username);

                if(emailCheck){
                    validate('Email Already Exist' , '/register', req, res );
                }else{


                    if(userNameCheck){
                        validate('Username Already Exist' , '/register', req, res );
                    }else{


                        
                        const reguser = await user.create({name, username, email, phone, gender, password : makeHash(password)})


                        const usern = await user.findOne().where('username').equals(username);
                        const token = createToken({id: usern._id}, (1000*60*60*24));
                       
                        const activationLink = `${process.env.APP_URL}:${process.env.PORT}/activate/${token}`
                        
                        verifyAccountMail(email, {
                            name: name,
                            activationLink: activationLink

                        });
                        validate('Registered successfully' , '/register' , req, res);

                      }
                   
                }
                
            }
        
    } catch (error) {
        validate(error.message , '/register', req, res) 
    }
}




// Login user 


const loginUser = async (req, res)=>{
    
    try {
        const { username, password} = req.body;

    //validation
            
            if( !username || !password ){

                validate('All fields are required' , '/login' , req, res)
            }
            
            
            const usern = await user.find().where('username').equals(username);
            

            if(usern.length == 0){

                validate('User not found', '/login', req, res);
            }

            if(usern.length > 0){

                if(!usern[0].verified){


                    validate('Please Activate your account though Email', '/login', req, res);
                }else{
                    const pass = bcrypt.compareSync(password , usern[0].password)

                    if(!pass){
                        validate('Wrong Password' , '/login', req, res);
                    }else{
                        
                        const token = createToken({id: usern[0]._id}, (1000*60*60*24*30));
                        res.cookie('authToken', token);
                        req.session.user = usern[0];
                        res.redirect('/')
                    }

                }
                
            }
        
    } catch (error) {
        validate(error.message , '/login', req, res) 
    }
}


// Logut user


const logoutUser = (req, res)=>{

    delete req.session.user,
    res.clearCookie('authToken');

    validate('Logut Successful', '/login', req, res);


};


//Activation user



const userActivation =async (req, res)=>{
    try {
        const {token} = req.params; 

        const tokenVerify = jwt.verify(token, process.env.JWT_SECRET);
        
        if(!tokenVerify){
            validate('Invalid Activation Link', '/login',req, res);


        }else{
            const activationUser = await user.findOne().where('_id').equals(tokenVerify.id);



            if(activationUser.verified){
                validate('Account Already Activated', '/login',req,res);
            }else{
                await user.findByIdAndUpdate(tokenVerify.id , {
                    verified : true
                });

                validate('Your account successfully activated, Login Now', '/login', req, res);
            }
        }
    } catch (error) {
        console.log(error.message);
    }

}

//Edit User Data

const editUser = (req, res)=>{

    res.render('edit')






}





//Profile Photo Change



const profilePhotoChange = (req, res)=>{

    res.render('changephoto')


}









// Profile Photo Upate


const profileUpdate =async (req, res)=>{

    try {
        
        await user.findByIdAndUpdate(req.session.user._id ,{
            photo: req.file.filename
        });
        req.session.user.photo = req.file.filename;

        validate('Profile Photo Updated' ,  '/change-photo', req,res);



    } catch (error) {
        validate(error.message, '/login', req,res)
    }

}


// User Password Change



const userPasswordChange = (req, res)=>{

    res.render('password')

}



// User Password Update


const userPasswordUpdate =async (req, res)=>{


    try {
        




        const {password, newpassword, confirmpassword} = req.body;
    
        const username = req.session.user.username;
    
    
        const usern = await user.findOne().where('username').equals(username);
    
        
        const passCheck = await bcrypt.compareSync(password, usern.password);
    
        if(passCheck){
    
            if(newpassword == confirmpassword){
    
                const newPassCheck = await bcrypt.compareSync(newpassword, usern.password);
    
                if(!newPassCheck){
    
                    await user.findByIdAndUpdate(usern._id ,{
                        password: makeHash(newpassword),
                    })
    
                    validate('Password Changed', '/change-password', req, res)
    
    
                }else{
                    validate('You Have Entered Old Password', '/change-password' , req, res)
                }
    
            }else{
                validate('New Password & Confirm Password Not Matched', '/change-password', req, res)
            }
    
    
    
        }else{
    
            validate('Wrong Old Password', '/change-password', req, res);
        }


    } catch (error) {
        validate(error.message, '/change-password', req, res)
    }

}


//Galary Photo

const galaryPhoto = async (req, res)=>{
    res.render('galary')


}

//Galary Photo Update


const galaryPhotoChange =async (req, res)=>{

    try {

        

            let file_arr = [];
    
            req.files.forEach(items => {
                file_arr.push(items.filename);
                req.session.user.gallery.push(items.filename);
            });
    
            // data push
    
            await user.findByIdAndUpdate(req.session.user._id,{
                $push:{
                    gallery: {$each: file_arr },
    
                }
            })

       

       
                

             validate('Photo Uploaded ', '/gallery',req, res) ;         
        
    }catch(error) {

                    validate(error.message, '/gallery', req, res);
    }

}


// Edit User Info update


const editUserUpdate = async (req, res) =>{


    try{
        const{name, username, email, phone, gender} = req.body;

        
        
        if(!name,!username, !email, !phone, !gender){
            validate('All Fields Are Required', '/edit', req, res);


        }else{
            const id = req.session.user._id;



            const unerFind = await user.findOne().where('_id').equals(id);
           
            const usernameCheck = await user.findOne().where("username").equals(username);
            
            const emailCheck = await user.findOne().where("email").equals(email);
    
            if( emailCheck && email != unerFind.email ){
    
                validate('Email Already exist', '/edit', req, res);

                if(usernameCheck && username != unerFind.username){
                    validate('Username Already Exist', '/edit', req, res);
                }else{


                    await user.findByIdAndUpdate(unerFind._id , {
                        name: name,
                        username: username,
                        email: email,
                        phone: phone,
                        gender: gender
                    });
    
                    req.session.user.name = req.body.name;
                    req.session.user.username = req.body.username;
                    req.session.user.email = req.body.email;
                    req.session.user.phone = req.body.phone;
                    req.session.user.gender = req.body.gender;
                }

    
            }


            validate('Info Updated Successfully', '/edit', req, res);

        }



        
    } catch (error) {
        validate("Email Already exist", '/edit', req, res)
    }

    

}









module.exports={
    profilePage,
    loginPage,
    registerPage,
    registerUser,
    loginUser,
    logoutUser,
    userActivation,
    editUser,
    profilePhotoChange,
    userPasswordChange,
    profileUpdate,
    galaryPhoto,
    galaryPhotoChange,
    editUserUpdate,
    userPasswordUpdate
}