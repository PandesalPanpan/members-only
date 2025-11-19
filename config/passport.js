const passport = require("passport");
const pool = require("../db/pool");
const LocalStrategy = require('passport-local').Strategy;


const verifyCallback = async (username, password, done) => {
    try {
        const { rows } = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = rows[0];
        
        if (!user) {
            done(null, false, { message: "User is not found." });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return done(null, false, { message: "Password is incorrect."});
        }
        
        done(null, user);
    } catch (error) {
        return done(error);
    }
}

passport.use(
    new LocalStrategy(verifyCallback)
)
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
    try {
        const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);
        const user = rows[0];
        done(null, user);
    } catch (error) {
        return done(error);
    }
})

