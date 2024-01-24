const express= require('express');
const router = express.Router();
const userRoutes = require('./user');
const accountRouter = require('./account');



router.use('/user', userRoutes);
router.use('/account', accountRouter);

//define all the routes here
router.get('/', (req, res)=>{
    res.send("hii there");
})


module.exports = router;