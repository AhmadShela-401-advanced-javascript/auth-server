/* eslint-disable no-undef */
'use strict';

module.exports = (action)=>{
    return (req,res,next)=>{
        console.log('Hiiiiiii i am innnnn',req.user);
        if(req.user){
            if(req.user.role.includes(action)){
               return next();
            }
            return  next('You dont have permission to this rout !!');
        }
    }
}