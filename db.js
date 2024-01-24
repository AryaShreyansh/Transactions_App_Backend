const mongoose= require('mongoose');

exports.dbConnect = ()=>{
   return mongoose.connect('mongodb://0.0.0.0:27017/Paytm-DB',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
   })
    .then(()=> console.log("Successfully connected to the database"))
    .catch((err)=> console.log("error occured while connecting to the database"));


}

