const pool = require("./pool")



// 1. Get All Messages With Users
module.exports.getAllMessagesWithUsers = async () => {
    const { rows } = await pool.query(`
        SELECT id, title, message, timestamp FROM messages
        `)

    return rows;
}

// 2. Get All Messages Without Users
module.exports.getAllMessagesWithoutUsers = async () => {
    const { rows } = await pool.query(`
        SELECT * FROM messages
        `);

    return rows;
}

// 3. Post Create User
module.exports.createUser = async (
    username, first_name, last_name, password
) => {
    const { rows } = await pool.query(`
        INSERT INTO users (username, first_name, last_name, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id
        `, [username, first_name, last_name, password]);
    const userId = rows[0];

    return !!userId;
}
// 4. Get User
module.exports.getUser = async (userId) => {
    const { rows } = await pool.query(`
        SELECT * FROM users WHERE id = $1
        `, [userId]);

    const user = rows[0]

    return user;
}
// Queries
// 6. Post Create Message
// 7. Delete Message (Admin Only)

// 5. Update user membership
module.exports.updateUserMembership = async (userId, isMember) => {
    const { rows } = await pool.query(`
        UPDATE users
        SET is_member = $2
        WHERE id = $1
        RETURNING *
        `, [userId, isMember]);
    
    return rows[0];
}