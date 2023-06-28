const { bookSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user && req.user.is_admin === 1) {
        req.is_admin = true;
        return next();
    }
    req.is_admin = false;
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect('/login');
};

module.exports.validateBook = (req, res, next) => {
    const { error } = bookSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}