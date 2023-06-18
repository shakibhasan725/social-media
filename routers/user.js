const express = require('express');


const {profilePage, loginPage, registerPage, registerUser, loginUser, logoutUser, userActivation, editUser,profilePhotoChange,userPasswordChange,profileUpdate,galaryPhotoChange,galaryPhoto, editUserUpdate, userPasswordUpdate}=require('../controllers/userController');
const authRedirect = require('../middlewares/authRedirectMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const multer = require('multer');

const path = require('path');




const router = express.Router();


//Multer Config

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{

            const fieldname = file.fieldname ;
       
            if(fieldname == 'photo'){

                cb(null, path.join(__dirname, '../public/media/users'));
            }
            
            if(fieldname == 'gallery'){
                
                cb(null, path.join(__dirname, '../public/media/gallery'));
            }
            



    },
    filename: (req, file, cb)=>{
        cb(null, Date.now() + '_' + file.originalname );

    }
})


// Create Multer Middlewares


const profilePhotoUpdate = multer({

    storage
}).single('photo');

//Gallary photo update

const galaryPhotoUpdate = multer({

    storage
}).array('gallery' , 5);







//Routers 




router.get('/', authRedirect , profilePage);
router.get('/edit', authRedirect , editUser);
router.post('/edit', authRedirect , editUserUpdate);
router.get('/change-photo', authRedirect , profilePhotoChange);
router.get('/gallery', authRedirect , galaryPhoto);
router.post('/gallery', galaryPhotoUpdate , galaryPhotoChange);
router.post('/change-photo', profilePhotoUpdate , profileUpdate);
router.get('/change-password', authRedirect , userPasswordChange);
router.post('/change-password', authRedirect , userPasswordUpdate);










router.get('/login',authMiddleware, loginPage);
router.post('/login',authMiddleware, loginUser);
router.get('/register',authMiddleware,  registerPage);
router.post('/register',authMiddleware, registerUser);










router.get('/logout', logoutUser);
router.get('/activate/:token', userActivation);














// export module


module.exports = router;