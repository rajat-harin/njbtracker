const mysql = require('mysql');
function connectDatabase() {
        const connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'njb_tracking_system'
        });

        connection.connect((err)=>{
            if (err) {
                console.log(err);
            }
            else
                console.log('Connected to the database!');
        });
    return connection;
}

module.exports = connectDatabase();