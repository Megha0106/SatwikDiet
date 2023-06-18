const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name:{
        type:String,  
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    nutritions:{
        date:Date,
        nutritionArray:[{
            foodItem:String,
            calories:Number,
            fats:Number,
            carbs:Number,
            proteins:Number  
       }]  
    },
    avgNutrition:{
        avgCals:Number,
        avgFats:Number,
        avgCarbs:Number,
        avgProteins:Number,
        date:Date
    },
    gender:String,
    weight:String,
    height:String,
    bp:String,
    oxygen:String,
    sugar:String,
},{timestamps:true}
)

userSchema.pre('save',function(next){
    const user = this;
    if(!user.isModified('password')){
        return next()
    }
    bcrypt.genSalt(10,(err,salt)=>{
        if(err){
            return next(err)
        }
        bcrypt.hash(user.password,salt,(err,hash)=>{
            if(err)
            {
                return next(err)
            }
            user.password = hash
            return next()
        })
    })
})

userSchema.methods.comparePassword = function(candidatePassword){

    const user = this;
    return new Promise((resolve,reject)=>{
        bcrypt.compare(candidatePassword,user.password,(err,isMatch)=>{
            if(err){
                return reject(err)
            }
            if(!isMatch){
                return reject(err)
            }
            resolve(true)
        })
    })
}

mongoose.model('User',userSchema)