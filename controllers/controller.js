const passport = require('passport');
const query = require('../db/queries');
const { hashPassword } = require('../lib/passwordUtils');
const { isAuth, isAdmin } = require('../middlewares/auth');

require('../db/queries');
// Get Index (Query will depend on User)
module.exports.indexPageGet = async (req, res) => {
    let messages;
    const isAuthenticated = !!req.user;
    const isMember = !!(req.user && req.user.is_member);
    const isAdmin = !!(req.user && req.user.is_admin);

    if (!isAuthenticated || isMember === false) {
        messages = await query.getAllMessagesWithoutUsers();
    } else if (isAdmin || isMember) {
        messages = await query.getAllMessagesWithUsers();
    } else {
        messages = await query.getAllMessagesWithoutUsers();
    }

    res.render('index', { messages, isAdmin });
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
    async (req, res) => {
        // Must be authenticated
        const { title, message } = req.body;
        const userId = req.user.id;
        await query.createMessage(title, message, userId);
        res.redirect('/');
    }
]

// Delete Message
module.exports.deleteMessage = async (req, res) => {
    // Must be admin

    const { message_id } = req.params;
    await query.deleteMessage(message_id);

    res.redirect('/');
}

// Get Create User Page
module.exports.createUserGet = (req, res) => {
    res.render('sign-up');
}

// Post Create User
module.exports.createUserPost = async (req, res) => {
    const { username, first_name, last_name, password } = req.body;

    const hashedPassword = await hashPassword(password);

    await query.createUser(username, first_name, last_name, hashedPassword);
    res.redirect('/login');
}

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
        // Must be authenticated
        res.render("membership");
    }
]

// Post Membership to User
module.exports.updateMembershipPost = [
    isAuth,
    async (req, res) => {
        const { passcode } = req.body;

        if (passcode !== "null") {
            return res.render("membership", {
                errors: [
                    { msg: "Invalid passcode " }
                ]
            });
        }

        await query.updateUserMembership(req.user.id, true);

        res.redirect('/')
    }
]
