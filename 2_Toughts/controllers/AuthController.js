const User = require('../models/User');

const bcrypt = require('bcryptjs');

module.exports = class AuthController {
    static login(req, res) {
        res.render('auth/login');
    }

    static async loginSave(req, res) {
        const { email, password } = req.body;

        // check if user exists
        const user = await User.findOne({where: { email: email }});

        if(!user) {
            req.flash('message', 'User not found!');
            return res.render('auth/login');
        }

        // check if password is correct
        const checkIfPasswordIsCorrect = bcrypt.compareSync(password, user.password);

        if(!checkIfPasswordIsCorrect) {
            req.flash('message', 'Password invalid!');
            return res.render('auth/login');
        }

        // initialize session
        req.session.userId = user.id;

        req.flash('message', 'Login successful!');

        req.session.save(() => {
            res.redirect('/');
        });
    }

    static register(req, res) {
        res.render('auth/register');
    }

    static async registerSave(req, res) {
        const { name, email, password, confirmPassword } = req.body;

        // password match validation
        if(password !== confirmPassword) {
            req.flash('message', 'Passwords don\'t match, try again!');
            return res.render('auth/register');
        }

        // check if user already exists
        const checkIfUserExists = await User.findOne({where: { email: email }});

        if(checkIfUserExists) {
            req.flash('message', 'User already exists, try another one!');
            return res.render('auth/register');
        }

        // hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const user = {
            name,
            email,
            password: hashedPassword,
        }

        try {
            const createdUser = await User.create(user);

            // initialize session
            req.session.userId = createdUser.id;

            req.flash('message', 'User created successfully!');

            req.session.save(() => {
                res.redirect('/');
            });
        } catch (error) {
            console.log(error);
            req.flash('message', 'Error creating user, try again!');
            return res.render('auth/register');
        }
    }

    static logout(req, res) {
        req.session.destroy(() => {
            res.redirect('/login');
        });
    }
}