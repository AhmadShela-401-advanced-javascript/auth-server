/* eslint-disable no-undef */
'use strict';
const users = require('../models/users-schema');
module.exports = async (req,res,next)=>{
if(!req.headers.authorization){
    console.log(req.headers.authorization);
    return next('Invalid Login, No Headers !!');
}else{
    let token = req.headers.authorization.split(' ')[1]
    let isUserAuthorize = await users.authoraizeUser(token)
if(isUserAuthorize){
    // return isUserAuthorize;
    next();
}else{
    return next('Invalid Login, No Headers !!');
}
}
}