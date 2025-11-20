const passport = require('passport');
const query = require('../db/queries');
const { hashPassword } = require('../lib/passwordUtils');
const { isAuth, isAdmin } = require('../middlewares/auth');
const { body, validationResult } = require('express-validator');
require('../db/queries');

const validateUser = [
    body("username").trim()
        .isAlphanumeric().withMessage("Username must only contain alphanumerics characters.")
        .isLength({ min: 6 }).withMessage("Username must be atleast 6 characters."),
    body("first_name").trim()
        .isAlpha().withMessage("First name must only contain alpha characters.")
        .isLength({ min: 2 }).withMessage("First name must be atleast 2 characters."),
    body("last_name").trim()
        .isAlpha().withMessage("Last name must only contain alpha characters.")
        .isLength({ min: 2 }).withMessage("Last name must be atleast 2 characters."),
    body("password")
        .isLength({ min: 8 }).withMessage("Password minimum is 8 characters"),
    body("confirm_password").custom((value, { req }) => {
        return value === req.body.password
    }).withMessage("Passwords does not match.")
]

const validateMessage = [
    body("title").trim()
        .isLength({ min: 1 }).withMessage("Title must atleast have 1 character."),
    body("message").trim()
        .isLength({ min: 1 }).withMessage("Message must atleast have 1 character.")
]


// Get Index (Query will depend on User)
module.exports.indexPageGet = async (req, res) => {
    let messages;
    if (!res.locals.isAuthenticated || res.locals.isMember === false) {
        messages = await query.getAllMessagesWithoutUsers();
    } else if (res.locals.isAdmin || res.locals.isMember) {
        messages = await query.getAllMessagesWithUsers();
    } else {
        messages = await query.getAllMessagesWithoutUsers();
    }

    res.render('index', { messages });
}

// Get Create Message Page 
module.exports.createMessageGet = [
    isAuth,
    (req, res) => {
        // Must be authenticated
        res.render('create-message');
    }
]

// Post Message
module.exports.createMessagePost = [
    isAuth,
    validateMessage,
    validateMessage,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('create-message', { errors: errors.array() })
        }

        const { title, message } = req.body;
        const userId = req.user.id;
        await query.createMessage(title, message, userId);
        res.redirect('/');
    }
]

// Delete Message
module.exports.deleteMessage = [
    isAdmin,
    async (req, res) => {
        const { messageId } = req.params;
        await query.deleteMessage(messageId);
        res.redirect('/');
    }

]

// Get Create User Page
module.exports.createUserGet = (req, res) => {
    res.render('sign-up');
}

// Post Create User
module.exports.createUserPost = [
    validateUser,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('sign-up', {
                errors: errors.array()
            });
        }

        const { username, first_name, last_name, password } = req.body;

        const hashedPassword = await hashPassword(password);

        await query.createUser(username, first_name, last_name, hashedPassword);
        res.redirect('/login');
    }
]

// Get Login User Page
module.exports.loginGet = (req, res) => {
    res.render('login');
}

// Post Login
module.exports.loginPost = passport.authenticate(
    "local",
    {
        failureRedirect: '/login-failure',
        successRedirect: "/"
    }
);

// Get Logout User
module.exports.logout = [
    isAuth,
    (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.redirect('/');
        });
    }
]

// Get Membership Page
module.exports.updateMembershipGet = [
    isAuth,
    (req, res) => {
        if (req.user.is_member) {
            return res.redirect('/');
        }

        res.render("membership");
    }
]

// Post Membership to User
module.exports.updateMembershipPost = [
    isAuth,
    async (req, res) => {
        if (req.user.is_member) {
            return res.redirect('/');
        }

        const { passcode } = req.body;

        if (passcode === "maculit") {
            await query.updateUserRoles(req.user.id, true, true);
            return res.redirect('/');
        }

        if (passcode === "null") {
            await query.updateUserRoles(req.user.id, true, false);
            res.redirect('/')
        }

        return res.render("membership", {
            errors: [
                { msg: "Invalid passcode " }
            ]
        });
    }
]
