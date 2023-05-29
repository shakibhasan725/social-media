const mongoose = require('mongoose');



//mongoDB Connection


const mongoDBConnection = async ()=>{

    try{

        const connect = await mongoose.connect(process.env.MONGO_URL);
        console.log(`mongoDB Connected Succesfully`);

    }catch(error){
        console.log(error.message);
    }


}




module.exports =  mongoDBConnection;


    
