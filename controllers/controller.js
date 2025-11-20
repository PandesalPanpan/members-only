const query = require('../db/queries');

require('../db/queries');
// Get Index (Query will depend on User)
module.exports.indexPageGet = (req, res) => {
    // Attach middleware here for auth, membership, and admin

    res.render('index');
}

// Get Create Message Page 
module.exports.createMessageGet = (req, res) => {
    // Must be authenticated
    res.render('create-message');
}

// Post Message
module.exports.createMessagePost = async (req, res) => {
    // Must be authenticated
    const { title, message } = req.body;
    await query.createMessage(title, message);
    res.redirect('/');
}

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

    await query.createUser(username, first_name, last_name, password);
    res.redirect('/');
}

// Get Login User Page
module.exports.loginGet = (req, res) => {
    res.render('login');
}

// Post Login
module.exports.loginPost = (req, res) => {
    // Authenticate

    res.redirect('/');
}

// Get Logout User
module.exports.logout = (req, res) => {
    // Must be authenticated
    // Removing the passport user in the req property?
    res.direct('/');
}

// Get Membership Page
module.exports.updateMembershipGet = (req, res) => {
    // Must be authenticated
    res.render("membership");
}

// Post Membership to User
module.exports.updateMembershipPost = async (req, res) => {
    // Must be authenticated
    // Grab the userId from the request
    const { passcode } = req.body;
    
    if (passcode === null) {
        res.render("membership", {errors: 'Invalid passcode'});
    }

    await query.updateUserMembership(req.user.id, true);
    
    res.redirect('/')
}