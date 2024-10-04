const express = require('express');
const User = require('../models/User');
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'HarshitisaGoodBoy'

// ROUTE 1: Create a use using: POST "/api/auth/createuser". Doesn't require Auth. NO login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid name').isEmail(),
    body('password', 'Password must be atleast of length 5').isLength({ min: 5 }),
], async (req, res) => {

    //if there are error return bad req and the error

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.send(`Hello, ${req.query.person}!`);
        return res.status(400).json({ errors: errors.array() });
    }

    //Check whether the user with same email exists already
    try {
        let user = await User.findOne({ email: req.body.email })


        if (user) {
            return res.status(400).json({ error: "Sorry, email already exists" })
        }

        const salt = await bcrypt.genSalt(10)
        const secPass = await bcrypt.hash(req.body.password, salt)
        //creating a new user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email,
        });

        const data = {
            user: {
                id: user.id,
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        // console.log(authToken);
        // res.json(user)
        res.json({ authToken })

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error Occurred")
    }


    // .then(user => res.json(user))  //bcz we are using async await
    // .catch(err=>{console.log(err)
    // res.json({error: "Please enter unique value", message: err.message})}) 


})


//ROUTE 2 : Authenticate a user using: POST "/api/auth/login". Doesn't require Auth. NO login required

router.post('/login', [
    body('email', 'Enter a valid name').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {

    //if there are error return bad req and the error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.send(`Hello, ${req.query.person}!`);
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        //checking if the email exist 
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" })
        }

        //comparing the user given password with the stored password
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Please try to login with correct credentials" })
        }

        const data = {
            user: {
                id: user.id,
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.send(authToken);

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error Occurred")
    }
});





//ROUTE 3 : Get a Loggedin user details using: POST "/api/auth/getuser". login is required

router.post('/getuser',fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error Occurred")
    }
})

module.exports = router;