const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')

const router = Router()

// /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Invalid Email').isEmail(),
    check('password', 'Password minimal length is 6 symbols').isLength({min: 6})
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Register data is invalid'
      })
    }

    const {firstName, lastName, phone, email, password} = req.body

    const candidate = await User.findOne({email: email})
    if (candidate) {
      return res.status(400).json({message: 'This email is already registered, please use it to log in'})
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = User({firstName, lastName, phone, email, password: hashedPassword})
    console.log(user);
    await user.save()
    const token = jwt.sign(
      {userId: user.id},
      config.get('jwtSecret'),
      {expiresIn: '1h'}
    )

    res.status(201).json({token, userId: user.id, message: 'Registration complete!'})
    
  } catch (error) {
    res.status(500).json({message: 'Something went wrong, please try again'})
  }
})

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Enter correct password').normalizeEmail().isEmail(),
    check('password', 'Enter correct password').exists()
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Login data is invalid'
      })
    }

    const {email, password} = req.body

    const user = await User.findOne({email})

    if (!user) {
      return res.status(400).json({
        message: `User doesn't exist`
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({
        message: `Password is incorrect, try again`
      })
    }

    const token = jwt.sign(
      {userId: user.id},
      config.get('jwtSecret'),
      {expiresIn: '1h'}
    )

    res.json({token, userId: user.id})
    
  } catch (error) {
    res.status(500).json({message: 'Something went wrong, please try again'})
  }
})

module.exports = router