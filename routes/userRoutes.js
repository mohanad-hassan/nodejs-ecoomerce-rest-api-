const {getAllUsers,getSingleUser,showCurrentUser,updateUser,updateUserPassword}  = require("../controllers/userController")
const {authenticationMiddleWare,authorizationMiddleware }  = require("../middleware/authentication")
const express = require("express") 
    const router  = express.Router()
//to avoid problems you should set the :id routers in the bottom .

//just admin can use this router 
    router.route('/').get(authenticationMiddleWare,authorizationMiddleware("admin"),getAllUsers)

    router.route('/showMe').get(authenticationMiddleWare,showCurrentUser)

router.route('/updateUser').patch(authenticationMiddleWare,updateUser)

router.route('/updateUserPassword').patch(authenticationMiddleWare,updateUserPassword)

router.route("/:id").get(authenticationMiddleWare,getSingleUser)



    module.exports = router ; 