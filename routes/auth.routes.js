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
    check('email', 'Неверный email').isEmail(),
    check('password', 'Минимальная длина пароля составляет 6 символов').isLength({min: 6})
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Регистрационная информация некорректна'
      })
    }

    const {firstName, lastName, phone, email, password} = req.body

    const candidate = await User.findOne({email: email})
    if (candidate) {
      return res.status(400).json({message: 'Пользователь с таким email уже зарегистрирован, пожалуйста, используйте его, чтобы войти'})
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = User({firstName, lastName, phone, email, password: hashedPassword})

    await user.save()
    const token = jwt.sign(
      {userId: user.id},
      config.get('jwtSecret'),
      {expiresIn: '1h'}
    )

    res.status(201).json({token, userId: user.id, message: 'Registration complete!'})
    
  } catch (error) {
    res.status(500).json({message: 'Что-то пошло не так, пожалуйста, повторите попытку позже'})
  }
})

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Ввкдите корректный пароль').exists()
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Информация логина некорректна'
      })
    }

    const {email, password} = req.body

    const user = await User.findOne({email})

    if (!user) {
      return res.status(400).json({
        message: `Пользователя с таким email не существует, пожалуйста, зарегистрируйтесь`
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({
        message: `Введен неверный пароль`
      })
    }

    const token = jwt.sign(
      {userId: user.id},
      config.get('jwtSecret'),
      {expiresIn: '1h'}
    )

    res.json({token, userId: user.id})
    
  } catch (error) {
    res.status(500).json({message: 'Что-то пошло не так, пожалуйста, повторите попытку позже'})
  }
})

module.exports = router