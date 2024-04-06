//تزریق وابستگی بع این معناست
// اگر کلاس الف به کلاس ب وابسته است،
//بیایم خارج از کلاس الف، یک نمونه از کلاس ب بسازیم و اون شیء رو پاس بدیم به کلاس الف
// نه اینکه بیایم و ساخت شیء جدید رو داخل کلاس الف انجام بدیم.

// UserService.js
class UserService {
  constructor(database) {
    this.database = database;

    // خط پایین کار درستی نیستش
    //this.database = new Database();
  }
  getUser(id) {
    return this.database.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

module.exports = UserService;


// Database.js
class Database {
  constructor() {
    // Initialize database connection
  }

  query(sql) {
    // Execute SQL query and return results
  }
}
module.exports = Database;





// app.js
const express = require('express');
const bodyParser = require('body-parser');
const Database = require('./Database');
const UserService = require('./UserService');

const app = express();
app.use(bodyParser.json());

const database = new Database();
const userService = new UserService(database);

app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  userService.getUser(userId)
    .then(user => res.json(user))
    .catch(err => res.status(500).json({ error: err.message }));
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
