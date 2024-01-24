const express= require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const zod= require('zod');
const { User } = require('../model/User');
const { JWT_SECRET } = require('../config');
const { authMiddleware } = require('../middleware');
const { Account } = require('../model/Accounts');


const signupSchema = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string(),
})


router.post("/signup", async(req, res)=>{
    
    const {username, firstName, lastName, password}= req.body;
    //validate the inputs
    const {success} = signupSchema.safeParse({
        username,
        firstName,
        lastName,
        password
    });

    if(!success ){
        return res.status(411).json({
            message:"Incorrect Inputs-> validation failed",
            success: false,
        })
    }

    
    

    //check if the user is already present
    const existingUser = await User.findOne({username});
    if(existingUser){
        return res.status(411).json({
            msg:"Email already taken",
            success: false,
        })
    }

    const user = await User.create({
        username, firstName, lastName, password
    });

    //fetch the user id to be passed in the token
    const userId = user._id;

    // assign some random account balance to this user
    const acc = await Account.create({
        userId,
        balance: 1+ Math.random()*10000,
    })


    const token = jwt.sign({
        userId
    }, JWT_SECRET);

    return res.status(200).json({
        msg:"User has been successfully created in the database",
        success: true,
        token: token,
    })
    
})

//validation for signin
const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
})

router.post('/signin', async(req, res)=>{
    const validateSignIn= signinSchema.safeParse(req.body);

    const {username, password} = req.body;

   // find the user exists in the db or not
   const user = await User.findOne({username, password});

   if(!user){
        return res.status(411).json({
            msg:" User doesn't exists",
            success: false,
        })

   }else{

        // sign the token
        const token = jwt.sign({
            userId: user._id,
        }, JWT_SECRET)

        res.json({
            token: token,
        })
        return;
   }

})

const updateSchema = zod.object({
    password:zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put('/', authMiddleware, async(req, res)=>{
    const {success} = updateSchema.safeParse(req.body);

    if(!success){
        res.status(411).json({
            msg:"Error while updating the information",

        })
    }
    const {firstName,lastName, password}= req.body;
    const updatedUser = await User.findOneAndUpdate({_id: req.userId}, {password:password, firstName:firstName, lastName:lastName});
    console.log(updatedUser);

    if(!updatedUser){
        res.status(411).json({
            msg:"error while updating the information"
        })
    }else{
        res.status(200).json({
            success: true, 
            msg:"User has been successfully updated",
        })
    }
});

// route to get users from the backend by firstname and lastname
// query-> filter 
router.get('/bulk', async(req, res)=>{

    const filter = req.query.filter ;

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

   return res.json({
        user: users.map(user=> ({
            username:user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id,
        }))
    })
})








module.exports= router;