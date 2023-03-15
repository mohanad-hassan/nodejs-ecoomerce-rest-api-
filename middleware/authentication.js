const CustomApiError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { isTokenValid ,createUserToken,createUserToken2} = require("../utils");
//this function is for take the token if excist  , parse it and push it to the req object  , and restrict is no token .
const authenticationMiddleWare = (req, res, next) => {
  const token = req.signedCookies.token;
  if (!token) {
    throw new CustomApiError.UnauthenticatedError("authenticate invalid");
  } else {
    const payload = isTokenValid(token);
    const user  = createUserToken(payload)
    req.user = user;
  }
  next();
};
//we use setup to pass parameters to callback function without executing it
const authorizationMiddleware = (...rest) => {
  return (req, res, next) => {
    const user = req.user;
    if (!rest.includes(user.role)) {
      throw new CustomApiError.Unauthorized(
        "only admin can access this route  "
      );
    }

    next();
  };
};

module.exports = { authenticationMiddleWare, authorizationMiddleware };
