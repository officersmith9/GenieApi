# Mint Db
Better than Mongo Db. Mint Db is the fast and easy frontend database.
## Terms of Privacy
You cannot look or share `MintDb/index.js` or you will pay a fine of 150g
You have to pay per project for Mint Db, so you cannot port Mint Db into another project without the owner's permission.

## Tutorial
### Set up
 - Require Mint Db into your express project. e.g:
 ```javascript
 const MintDb = require('./MintDb');
 ```
 - Init a new db. *Put this where you init your express app `const app = expres..`*
 ```javascript
 const db = new MintDb();
 ```
### DB Commands
1. Insert
 You don't need to create new tables for Mint Db, you just need to insert.
 Let's say want to insert into a table called `users` with a name, email and password, e.g:
 ```javascript
db.insert('users', {
    name: 'Name',
    email: 'email',
    password: 'password'
});
 ```
 To port this in your express app just put it in one off your routes, like so:
 ```javascript
 app.get('/users/create', (req, res) => {
    db.insert('users', req.query);
    res.json({ res: true });
 });
 ```

 2. Select 
 Let's say want to select a table called `users` with a name equal to `Bob Johnson` e.g:
 ```javascript
db.select('users', {
    name: 'Bob Johnson'
});
 ```
 To port this in your express app just put it in one off your routes, like so:
 ```javascript
app.get('/users', (req, res) => {
    res.json(db.select('users', req.query));
});
 ```

3. Delete
 Let's say want to delete a table called `users` with a name equal to `Bob Johnson` e.g:
 ```javascript
db.delete('users', {
    name: 'Bob Johnson'
});
 ```
 To port this in your express app just put it in one off your routes, like so:
 ```javascript
app.get('/users', (req, res) => {
    res.json(db.delete('users', req.query));
});
 ```

4. Update
 Let's say want to update a table called `users` with a name equal to `Bob Johnson` to a name equal to `Bob` e.g:
 ```javascript
db.delete('users', {
    name: 'Bob Johnson'
}, { name: 'Bob' });
 ```

## That's it!
To send you off here is a sample users backend I built to test this:
```javascript
const express = require('express');
const MintDb = require('./MintDb');

const app = express();
const cors = require('cors');
const db = new MintDb();

app.options('*', cors());

app.get('/users', (req, res) => {
    res.json(db.select('users', req.query));
});

app.get('/create', (req, res) => {
    db.insert('users', req.query);
    res.json({ res: true });
});

app.get('/delete', (req, res) => {
    db.delete('users', req.query);
    res.json({ res: true });
});

app.get('/update', (req, res) => {
    db.update('users', req.query, { name: 'Bob' });
    res.json({ res: true });
});

app.listen(5100);

```
Follow a tutroial to learn how to get started with Express. 