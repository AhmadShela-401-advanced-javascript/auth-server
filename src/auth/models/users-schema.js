/* eslint-disable no-undef */
'use strict';
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
// const SECRET = 'mytokensecret';
const userScema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        require: true
    }
});

const roles = {
    Admin:['READ','CREATE','UPDATE','DELETE'],
    Editor:['READ','CREATE'],
    writer:['READ','CREATE','UPDATE'],
    users:['READ']
}
// hooks
// right before the save , has the password
userScema.pre('save', async function () {
    console.log('userPass', this);
    console.log('password', this.password);
    this.password = await bcrypt.hash(this.password, 5);
});

// add methods to schema
// users.methods > will add methods on the schema
userScema.methods.comparePasswords = async function (password) {
    console.log('1');
    const valid = await bcrypt.compare(password, this.password);
    return valid ? this : null;
}

// add static methods
// users.statics > add static methods on the schema
userScema.statics.generateToken = function (userObj) {
        // expires after half and hour (900 seconds = 15 minutes)
        console.log('hhhhhhhhhhhhhhhhhh userObj',userObj);
    return jwt.sign({
        username: userObj.username,
        role: roles[userObj.role]
    }, process.env.TOKEN_SECRET, {expiresIn: '900s'});
    // return jwt.sign({
    //     username: userObj.username,
    //     actions: roles[userObj.role]
    // }, process.env.TOKEN_SECRET);
    // return jwt.sign({ username }, process.env.TOKEN_SECRET);
}

userScema.statics.authenticateBasic = async function (username, password) {
    console.log('inside authoraizeUser');
    let result = await this.findOne({username: username});
    if (result) {
        let compareResult = await result.comparePasswords(password);
        return compareResult;
    } else {
        return null;
    }
}
userScema.statics.authoraizeUser = async function (token) {
    if (! token) {
        return Promise.reject();
    }
    let jwtVarification = jwt.verify(token, process.env.TOKEN_SECRET, (err, decode) => {
        if (err) {
            console.log('myError 1 : ', err);
            return false;
        }
        return decode
    });
    if (jwtVarification.expiresIn) {
        var dateNow = new Date();
        if(decodedToken.exp<dateNow.getTime()/1000){
            console.log('the session time is out');
            return false;
        }
        }
        console.log('> >>>>>>>> jwtVarification ', jwtVarification);
 if (jwtVarification) {
            let user = await this.findOne({username: jwtVarification.username})
            console.log('>>>>>>>>>>>>>>',{user: user});
            return user ? Promise.resolve({user: jwtVarification}).catch(error => {
                console.log(error);
            }) : false;
        }
        console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii');
        return false;
}
module.exports = mongoose.model('users', userScema);
// const userFunctions = {}

// userFunctions.hashPass =  async function(record) {
//     return{
//         userName:record.username,
//         userPass: await bcrypt.hash(record.password, 5)
//     }
// }
// userFunctions.authenticateBasic = async function(username,password) {
//     let userLogin = new User();
//     let result = await userLogin.get({userName : username});
//     console.log('>>>>>>>result',result);
//     if(result.length > 0){
//         let userPassword = password
//         let hasedPass = result[0].userPass
//         // console.log('>>>>>>>userPassword',record);
//         let valid = await bcrypt.compare(userPassword,hasedPass)
//         let returnValue = valid ? result : Promise.reject();
//         return returnValue
//     }else{
//         return Promise.reject();
//     }
// }

// userFunctions.generateToken = function(username){
//     return jwt.sign({username: username},SECRET);
// }

// class User{
//     constructor(){
//         this.schema = mongoose.model('userScema',userScema);
//     }
//     async create(record){
//         console.log('>>>>>>>>>>>>>>>dataRecord',record);
//         let dataRecord = await userFunctions.hashPass(record)
//         let newUser = new this.schema(dataRecord);
//         return newUser.save();
//     }
//     get(query){
//         // let obj = val ? { prop : val } : {};
//         // console.log('>>>>>>>>>>OBJ',obj);
//         return this.schema.find(query);
//     }
//     getByuserName(userName){
//         let obj ={ userName };
//         return this.schema.find(obj);
//     }
//     update(_id,record){
//         return this.schema.findByIdAndUpdate(_id,record);
//     }
//     patch(_id,record){
//         return this.schema.findByIdAndUpdate(_id,record);
//     }
//     delete(_id){
//         return this.schema.findByIdAndDelete(_id)
//     }


// }
// module.exports = {
//     userFunctions : userFunctions,
//     userModel : new User()
// }
// module.exports = new User();
