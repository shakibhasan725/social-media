const nodemailer = require("nodemailer");

const dotenv = require("dotenv").config();






const verifyAccountMail = async (to, data) => {
    
    try {
        
    // Create a transport
    const transport =  nodemailer.createTransport({
        host:  process.env.EMAIL_HOST ,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
            
        }
    });
    
    // Create Mail
    await transport.sendMail({
        from: ` "Verify" <${process.env.EMAIL_HOST}> `,
        to: to,
        subject: 'Accout Acctivation Mail',
        html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome</title>
            <style>


        body{
            background-color: rgba(150, 107, 185, 0.377);
        }
                .container{
                    height: fit-content;
                    width: 450px;
                    background-color: rgba(19, 61, 139, 0.304);
                    margin: auto;
                    padding: 10px;
                    border-radius: 6px;
                    margin-top: 20px;
                }
                .container a{
                    margin-top: 30px;
                    display: block;

                    
                }
                .container a img{
                    height: 100px;
                    width: 100px;
                    margin:auto;
                    display: block;
                    border-radius: 50%;
                
                    
                    
                }
                #bgemg{
                    max-width: 100%;
                    margin-top: 30px;
                    border-radius: 5px;
                }
                h1{
                    text-align: center;
                    font-size: 25px;
                    margin-bottom: 30px;
                    color: rgb(22, 8, 113);
                }
                
                #button{
                    width: 90%;
                    padding: 15px;
                    font-size: 20px;
                    font-weight: bold;
                    background-color: rgba(37, 26, 88, 0.708);
                    color: white;
                    border-radius: 6px;
                    text-align: center;
                    text-decoration: none;
                    margin-left: 10px;
                
                }
                #button:hover{
                    background-color: rgba(42, 12, 173, 0.381);
                }
            </style>
        </head>
        <body>
            <div class="container">
                <a href="https://www.youtube.com/channel/UCy0RQGDFo89OctNs9JopJJA">
                    <img src="https://yt3.ggpht.com/ytc/AMLnZu-8B0oDDaTIKnZUFbQEOE-4oIu4JaHxzRNF5BpsWg=s176-c-k-c0x00ffffff-no-rj" alt="">
                </a>
                <img id="bgemg" src="https://i.ytimg.com/vi/kX0tq3qsY_U/maxresdefault.jpg" alt="">
                <h1>Hi  ,${data.name} Verify Your Account </h1>
                <a id="button" href="${data.activationLink}">Verify Your Account</a>
            </div>
        </body>
        </html>

        `

    });
    }catch (error) {
        console.log(error.message);
    }
    
    
};

module.exports = { verifyAccountMail } ;