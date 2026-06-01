import { pool } from '../db/db.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/generateToken.js'

export const signup = async (req, res) => {
  try{
    const {name, email, password } = req.body

    if(!name || !email || !password){
      return res.status(400).json({ message: "All fields are required" })
    }

    const emailCheck = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    if(emailCheck.rows.length > 0){
      return res.status(400).json({ message: "Email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await pool.query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *", [name, email, hashedPassword])
    res.status(201).json({ message: "User created successfully", user: newUser.rows[0] })
  }
  catch(err){
    console.error(err)
    res.status(500).json({ message: "Internal server error" })
  }
}

export const Login = async (req, res) => {
  try{
    const { email, password } = req.body
    if(!email || !password){
      return res.status(400).json({ message: "All fields are required" })
    }

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    if(user.rows.length === 0){
      return res.status(400).json({ message: "Invalid email or password" })
    }

    const isMatch = await bcrypt.compare(password, user.rows[0].password)
    if(!isMatch){
      return res.status(400).json({ message: "Invalid email or password" })
    }

    const token = generateToken(user.rows[0])

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        name: user.rows[0].name,
        email: user.rows[0].email,
      },
    })
  }
  catch(err){
    console.error(err)
    res.status(500).json({ message: "Internal server error" })
  }
}
