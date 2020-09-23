/* eslint-disable no-undef */
'use strict';

const users = require('./models/users-schema');

const basicAuth = require('./middleware/basicAuth');
const bearerMiddleware = require('./middleware/bearer-auth');
const aclMiddleWare = require('./middleware/acl-middleware');
const express = require('express');
const router = express.Router();

router.post('/signup', signUpHandler);
router.post('/signin',basicAuth, signInHandler);
router.get('/users',basicAuth, getAllUsers);
router.get('/secret',bearerMiddleware,getSecretInfo);
router.get('/secretPlus',bearerMiddleware,getSecretPlusInfo);
router.get('/posts',bearerMiddleware,aclMiddleWare("READ"),getPosts);
router.post('/posts',bearerMiddleware,aclMiddleWare("CREATE"),wirtePosts);
router.put('/posts',bearerMiddleware,aclMiddleWare("UPDATE"),updatePosts);
router.delete('/posts',bearerMiddleware,aclMiddleWare("DELETE"),deletePosts);

/**
 * this function respons the token to the user if it is not exist
 * @param {Object} req 
 * @param {Object} res 
 * @param {callBack} next 
 */
async function signUpHandler(req,res) {
    // first check if the username exists then add it if not 
    let user = new users(req.body);
    let isUserExist = await users.findOne({username:user.username})
    console.log('>>>>>>>>>>>>isUserExist',isUserExist);
        if(isUserExist){
            res.status(403).send("user is already exist");
            return;
        }
    // hash the password first
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    let registerdUser = await user.save()
        let token = users.generateToken(registerdUser);
        // let token = users.generateToken(registerdUser.username);
        res.status(201).send(token);
}

function signInHandler(req,res) {
    if(req.basicAuth) {
        // add the token as cookie 
        res.cookie('token', req.basicAuth.token);
        // add a header
        res.set('token', req.basicAuth.token);
        // send json object with token and user record
        res.status(200).json(req.basicAuth);
    } else {
        res.status(403).send("invaled login");
    }
}
function getAllUsers(req,res){
    if(req.basicAuth.token){
        users.find().then(result =>{
            res.status(200).json(result);
        })
    }else{
        res.status(403).send("invaled login");
    }
}
function getSecretInfo(req,res) {
    res.status(200).send(req.user)
}

function getSecretPlusInfo(req,res) {
    res.status(200).send('done')
}
function getPosts(req,res) {
    res.status(200).send('done')
}
function wirtePosts(req,res) {
    res.status(200).send('done')
}
function updatePosts(req,res) {
    res.status(200).send('done')
}
function deletePosts(req,res) {
    res.status(200).send('done')
}
module.exports = router