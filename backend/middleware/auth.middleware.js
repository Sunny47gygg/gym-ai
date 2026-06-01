import jwt from 'jsonwebtoken'

export const protectRoute = (req, res, next) => {
  try{
    const token = req.headers.authorization 

    if(!token){
      return res.status(401).json({ message: "Unauthorized" }) 
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    req.user = decoded

    next()
    
  }
  catch(err){
    console.error(err)
    res.status(401).json({ message: "Invalid Token" })
  }
}