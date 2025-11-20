
module.exports.currentUserMiddleware = (req, res, next) => {
    res.locals.currentUser = req.user || null;
    res.locals.isAuthenticated = !!req.user;
    res.locals.isMember = !!(req.user && req.user.is_member);
    res.locals.isAdmin = !!(req.user && req.user.is_admin);
    next();
}