// Node modules.


// 3rd party modules.
// const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

// Own modules.
const { generateJWT } = require('../helpers/generateJWT');
const { googleVerify } = require('../helpers/googleVerify');
const User = require('../models/user');


// Controller development.

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verify email (user) exists and is still active.
        const user = await User.findOne({email, state: true});

        if (!user) {
            return res.status(400).json({
                msg: 'Invalid credentials'
            });
        }

        // Validate password.
        const validPassword = bcryptjs.compareSync(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Invalid credentials'
            });
        }

        // Generate JWT
        const token = await generateJWT(user.id);

        return res.status(200).json({
            user,
            token
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            msg: 'System failure. Please contact the system administrator.'
        })
    }
}

const googleSignIn = async (req, res) => {
    const { id_token } = req.body;

    try {
        // const googleUser = await googleVerify(id_token);
        // console.log("Google User:", googleUser);
        
        const {email, name, picture} = await googleVerify(id_token);

        let user = await User.findOne({email});

        // If User does not exist. Create a new one using google's data.
        if (!user) {
            const data = {
                name,
                email,
                password: "...",
                image: picture,
                // role: "USER_ROLE",
                googleLinked: true
            }

            user = new User(data);

            await user.save();
        }

        // If User exists but it has been previously deleted. Don't allow access.
        if (!user.state) {
            return res.status(401).json({
                msg: "Invalid credentials. User locked."
            });
        }

        // Generate JWT
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        });

    } catch (error) {
        return res.status(400).json({
            msg: 'Invalid credentials. Google Sign In fialed'
        });
    }
}

const renewToken = async (req, res) => {
    const authenticatedUser = req.authenticatedUser;

    // Generate JWT
    const token = await generateJWT(authenticatedUser.id);

    return res.status(200).json({
        user: authenticatedUser,
        token
    });
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}