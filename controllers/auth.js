const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASS,
    database: process.env.MYSQL_NAME
});

exports.register = (req, res) => {

    const { name, email, password, passwordConfirm } = req.body;
    
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {
        if(error) {
            console.log(error);
        }
        if(results.length > 0){
            return res.render('register', {
                message: 'Email sudah terdaftar'
            });
        } else if(password !== passwordConfirm) {
            return res.render('register', {
                message: 'Password tidak cocok'
            });
        }

        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);
        
        db.query('INSERT INTO users SET ?', {name:name, email:email, password:hashedPassword}, (error, results) => {
            if(error) {
                console.log(error);
            } else {
                return res.render('register', {
                    message: 'Pendaftaran berhasil!'
                });
            }
        });
        // res.send("Form Submitted");

    });

}

exports.login = (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if(error) {
            console.log(error);
        }

        // console.log(email);
        // console.log(password);

        if(email !== results[0].email){
            return res.render('login', {
                message: 'Email tidak terdafatar'
            });
        }

        if(bcrypt.compare(password, results[0].email)){
            return res.render('login', {
                message: 'Login berhasil!'
            });
        }

    });

}