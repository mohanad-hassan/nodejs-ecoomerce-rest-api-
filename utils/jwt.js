const jwt = require("jsonwebtoken");

const createJwt = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

const isTokenValid = (token) => {
  const isTokenValid = jwt.verify(token, process.env.JWT_SECRET);
  return isTokenValid
};

const attachCookiesToResponse = ({ res, tokenUser }) => {
  //set the jsonwebtoken for authentication
  const token = createJwt(tokenUser);

    //send the to token to the cookies (instead of send it to frontend and then front end store it in local storage )
    const oneDay  = 1000*60*60*24 // transfer milliseconds to one day 

    //- cookies SECURE:TRUE means that it uses https mode and not http (in development you have to use http) .
   // - cookies SIGNED:TRUE it signature to see if the front end manipulate the cookie  , you have to set a password in cookies parser(secret) .
    res.cookie('token',token,{httpOnly:true,expires:new Date(Date.now()+oneDay),secure:process.env.NODE_ENV==='production',signed:true})
    
    //http is for prevent client to see the token , expires is saying when the cookies will expire and be deleted .
};

module.exports = { attachCookiesToResponse, isTokenValid };
