const bcrypt = require('bcrypt');
const crypto = require('crypto');
const {UACModel}  = require('../config/database');
const {Op} = require("sequelize");
const passpt = require('passport');


const registrar_promise_new_user = (req)=>{
    return new Promise((resolve,reject)=>{

        // This is absolutely terrible, I know.
           // 1. Verify if Request is Good, with all fields filled and included in body.
           const {Username, Email, Password, ConfirmPassword} = req.body;

           if(!Username || !Email || !Password || !ConfirmPassword)
               reject({"statusCode": 400,"message": "Missing some fields to register in the system."});

           if(Password != ConfirmPassword) 
                reject({"statusCode": 500, "message": "The passwords must be equals."});
           

            // Validate if password matches 14 characters, at least one lowercase, one uppercase and one special character.
            
            var re = new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{14,}$");
            if(!re.test(Password)){
                reject({"statusCode": 500, "message": "Your password must have minimun 14 characters, at least one lowercase, one uppercase and one special character."});
                return;
            }

           UACModel.findOne({
               where: {
                   [Op.or]:[
                       {Username: Username},
                       {Email: Email}
                   ]
               },
               attributes: ['UserID', 'Username', 'Email']
           }).then(checkUser => {

                if(checkUser === null) {
                    let levelEncrypt = 20;

                    if(process.env.APP_ENVIRONMENT == "Development")
                        levelEncrypt = 4;
         
                    let SaltGenerated = crypto.randomBytes(18).toString('base64'); 
                    let SaltGeneratedBunker = crypto.randomBytes(18).toString('base64');
         
                    let passwd = bcrypt.hashSync((Password + SaltGenerated), levelEncrypt);
                    //let fDate = new Date(birthdate).toISOString().slice(0,10);
                    
                    UACModel.create({
                        "Username": Username,
                        "Email": Email,
                        "Password": passwd,
                        "PasswordSalt":  SaltGenerated,
                        "ID_Role": 1,
                        "SaltBunker": SaltGeneratedBunker
                    })
                    .then(ret=>{
                        resolve({"statusCode": 200,"message": "Congratulations, your account was succefully created."})
                    })
                    .catch(err=>{
                        reject(
                                {"statusCode": 500,
                                 "message": `Error while registering your account in database: ${err.message}` 
                                });
                            });
                }
                else { reject({"statusCode": 500,"message": "This username or e-mail is already in use."}); }
            });

           
    }
)};

// Register new in 'access_user' table.
exports.register_new_user = (req,res)=>{
    
    res.setHeader('Content-Type', 'application/json');

    registrar_promise_new_user(req).then(ret=>{
        res.status(ret.statusCode || 200).send({"message": ret.message})   
    }).catch(err=>{
        res.status(err.statusCode || 500).send({"message": err.message});
    });
}
