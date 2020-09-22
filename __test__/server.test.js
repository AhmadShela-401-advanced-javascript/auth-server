/* eslint-disable no-undef */
'use strict';

const { server } = require('../src/server.js');
const supergoose = require('@code-fellows/supergoose');
const agent = supergoose(server);
const base64 = require('base-64');
describe('basic-auth middlleware', () => {
  let trueTestObj = {
    username: 'hussain1',
    password: '12345',
  };
  it('allow a new user to signup', async() => {
    let signupResponse = await agent.post('/signup').send(trueTestObj);
    expect(signupResponse.status).toBe(201);
    expect(!!signupResponse.text).toBeTruthy();
  });
  it('can allow an existing user to sign in', async() => {
    let authHeader = base64.encode(
      `${trueTestObj.username}:${trueTestObj.password}`,
    );
    let signinResponse = await agent
      .post('/signin')
      .set('authorization', `Basic ${authHeader}`);
    expect(signinResponse.status).toBe(200);
    expect(!!signinResponse.text).toBeTruthy();
  });
  it('will return a 500 error for incorrect login credentials', async() => {
    let realBadAuthHeader = base64.encode(
      `testingbobred:wrong-password1234`,
    );
    let signinResponse = await agent
      .post('/signin')
      .set('authorization', `Basic ${realBadAuthHeader}`);
    expect(signinResponse.statusCode).toBe(500);
    expect(signinResponse.body).toEqual({});
    let wrongPasswordHeader = base64.encode(
      `${trueTestObj.username}:wrong-password1234-again-555`,
    );
    let signinResponse2 = await agent
      .post('/signin')
      .set('authorization', `Basic ${wrongPasswordHeader}`);
    expect(signinResponse2.statusCode).toBe(500);
    expect(signinResponse2.body).toEqual({});
  });
});

// const { server } = require('../src/server');

// const supergoose = require('@code-fellows/supergoose');

// const mockRequest = supergoose(server);

// describe('API',()=>{
//     it('POST to /signup to create a new user', async ()=>{
//         let obj = {
//             username : "Ahmad",
//             password :"123"
//         }
//         let data = await mockRequest.post('/signup').send(obj);
//         expect(data.status).toBe(200);
//     });
//     it('POST to /signin to login as a user (use basic auth)', async ()=>{
//         let obj = {
//             username : "Ahmad",
//             password :"123"
//         }
//         let data = await mockRequest.post('/signup').send(obj);
//         expect(data.status).toBe(200);
//     })
// });