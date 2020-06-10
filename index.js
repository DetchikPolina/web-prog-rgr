const express = require("express");
const path = require('path');
const router = express.Router();
const app = express();
const expressHbs = require('express-handlebars')
const hbs = require('hbs')
const mysql = require('mysql2')
const cookieParser = require("cookie-parser")
const bodyParser = require('body-parser')
const connection = mysql.createConnection({
    host: "us-cdbr-east-06.cleardb.net",
    user: "bbd8cd783fddcb",
    password: "5558bc88",
    database : 'heroku_f7215c2b1052906'
}).promise()
var LocalStorage = require('node-localstorage').LocalStorage,
    localStorage = new LocalStorage('./scratch');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))
app.engine('hbs', expressHbs({
        layoutsDir: 'views',
        defaultLayout: 'layout',
        extname: 'hbs'
    }))
app.set('views', './views')
app.set('view engine', 'hbs')
app.enable('view cache')

router.get('/login', function (req, res) {
    let context = null
    try {
        context = req.cookies["context"]
    } catch (e) {
        context = null
    }
    if (context !== null) {
        res.clearCookie("context", { httpOnly: true })
        res.render("login", { msg: context })
    } else
        res.render("login")
});
router.post('/login', function (req, res) {
    const login = req.body.login
    const password = req.body.password
    const sql = 'SELECT login, password FROM `users` WHERE login=(?)';
    connection.query(sql, [login])
        .then(result => {
            if (result[0].length !== 0) {
                if (result[0][0].password == password) {
                    localStorage.setItem("login", login);
                    res.redirect("/")
                } else {
                    res.cookie("context", "Неверный пароль", { httpOnly: true })
                    res.redirect("login")
                }
            } else {
                res.cookie("context", "Пользователь не найден", { httpOnly: true })
                res.redirect("login")
            }
        })
        .catch(err =>{
            console.log(err);
        });
});
router.get('/logout', function (req, res) {
    localStorage.clear()
    res.redirect("/")
});
router.get('/registration', function (req, res) {
    let context = null
    try {
        context = req.cookies["context"]
    } catch (e) {
        context = null
    }
    if (context !== null) {
        res.clearCookie("context", { httpOnly: true })
        res.render("registration", { msg: context })
    } else
        res.render("registration")
});
router.post('/registration', function (req, res) {
    const login = req.body.login
    const password = req.body.password
    const repeated_password = req.body.repeated_password
    const sql = 'SELECT login FROM `users` WHERE login=(?)';
    connection.query(sql, [login])
        .then(result => {
            if (result[0].length == 0) {
                if (password == repeated_password) {
                    connection.query('INSERT users(login,  password) VALUES(?,?)',[login, password])
                    res.redirect("/")
                } else {
                    res.cookie("context", "Пароли не совпадают", { httpOnly: true })
                    res.redirect("registration")
                }
            } else {
                res.cookie("context", "Пользователь уже существует", { httpOnly: true })
                res.redirect("registration")
            }
        })
        .catch(err =>{
            console.log(err);
        });
});
router.get('/articles', function (req, res) {
    res.render('articles', { login: localStorage.getItem('login') });
});
router.get('/article1', function (req, res) {
    connection.query('SELECT text, login FROM comments INNER JOIN users ON comments.user_id = users.id and comments.article_number = 1')
        .then(result => {
            res.render('article1', {
                login: localStorage.getItem('login'),
                list: result[0]
            });
        })
        .catch(err =>{
            console.log(err);
        });
});
router.post('/article1', function (req, res) {
    const text = req.body.text
    const login = localStorage.getItem("login")
    const sql = 'INSERT comments(text, article_number, user_id) VALUES(?,1,(SELECT id FROM users WHERE login=?))'
    connection.query(sql, [text, login])
        .catch(err =>{
            console.log(err);
        });
    res.redirect("/article1")
});
router.get('/article2', function (req, res) {
    connection.query('SELECT text, login FROM comments INNER JOIN users ON comments.user_id = users.id and comments.article_number = 2')
        .then(result => {
            res.render('article2', {
                login: localStorage.getItem('login'),
                list: result[0]
            });
        })
        .catch(err =>{
            console.log(err);
        });
});
router.post('/article2', function (req, res) {
    const text = req.body.text
    const login = localStorage.getItem("login")
    const sql = 'INSERT comments(text, article_number, user_id) VALUES(?,2,(SELECT id FROM users WHERE login=?))'
    connection.query(sql, [text, login])
        .catch(err =>{
            console.log(err);
        });
    res.redirect("/article2")
});
router.get('/article3', function (req, res) {
    connection.query('SELECT text, login FROM comments INNER JOIN users ON comments.user_id = users.id and comments.article_number = 3')
        .then(result => {
            res.render('article3', {
                login: localStorage.getItem('login'),
                list: result[0]
            });
        })
        .catch(err =>{
            console.log(err);
        });
});
router.post('/article3', function (req, res) {
    const text = req.body.text
    const login = localStorage.getItem("login")
    const sql = 'INSERT comments(text, article_number, user_id) VALUES(?,3,(SELECT id FROM users WHERE login=?))'
    connection.query(sql, [text, login])
        .catch(err =>{
            console.log(err);
        });
    res.redirect("/article3")
});
router.get('/article4', function (req, res) {
    connection.query('SELECT text, login FROM comments INNER JOIN users ON comments.user_id = users.id and comments.article_number = 4')
        .then(result => {
            res.render('article4', {
                login: localStorage.getItem('login'),
                list: result[0]
            });
        })
        .catch(err =>{
            console.log(err);
        });
});
router.post('/article4', function (req, res) {
    const text = req.body.text
    const login = localStorage.getItem("login")
    const sql = 'INSERT comments(text, article_number, user_id) VALUES(?,4,(SELECT id FROM users WHERE login=?))'
    connection.query(sql, [text, login])
        .catch(err =>{
            console.log(err);
        });
    res.redirect("/article4")
});
router.get('/', function (req, res) {
    res.render('main', { login: localStorage.getItem('login') })
});
app.use('/', router);
app.listen(process.env.port || 3000);
console.log('Running at Port 3000');
