const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

exports.authMiddleware = async(req, res, next)=>{

    //fetch the token from headers
    const token = req.headers.authorization;
    if(!token || !token.startsWith('Bearer ')){
        return res.status(403).json({
            success: false,
            msg:"Token absent",
        })
    }

    const finalToken = token.split(' ')[1];
    

    try{

        const decoded = jwt.verify(finalToken, JWT_SECRET);

        if(decoded.userId){
            req.userId= decoded.userId;
            next();
        }else{
            return res.status(403).json({
                msg: "user can't be  verified",
            });
        }
        
    }
    catch(err){
    
        return res.status(403).json({
            msg:"error occurred in Auth ",
            error: err
            
        });

    }
 
}