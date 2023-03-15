
const createUserToken = (user) => {
  return ({ user: user.user, userId:user.userId, role: user.role,email:user.email }
  )
}

module.exports =  {createUserToken}