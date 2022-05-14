const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const { generalErrorHandler } = require('../middleware/error-handler')
const tweet = require('./modules/tweet')
const followship = require('./modules/followship')
const userController = require('../controllers/user-controller')
const { authenticated } = require('../middleware/auth')

const admin = require('./modules/admin')

router.use('/admin', admin)
router.use('/tweets', tweet)
router.use('/followships', followship)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/logout', userController.logout)
router.get('/users/setting/:id', authenticated, userController.getSetting)
router.put('/users/setting/:id', authenticated, userController.putSetting)

router.use('/', (req, res) => res.render('index'))
router.use('/', generalErrorHandler)
module.exports = router
