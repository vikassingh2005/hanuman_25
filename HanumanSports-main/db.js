const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'pradyu', // Your MySQL username
    password: 'pradyu2916', // If using XAMPP default, leave this empty. If you set a password, enter it here.
    database: 'hanuman_sports' 
});

module.exports = db.promise();