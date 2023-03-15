
const createUserToken2 = (user) => {
    return ({ user: user.name, userId:user._id, role: user.role,email:user.email }
    )
  }
  
  module.exports =  {createUserToken2}