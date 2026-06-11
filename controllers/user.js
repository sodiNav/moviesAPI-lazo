const User = require(`../models/User`);
const bcrypt = require('bcryptjs'); 

const auth = require('../auth');
const {errorHandler} = require('../auth');

module.exports.registerUser = (req, res) => {
    
    if(!req.body.email.includes("@")){
        return res.status(400).send({ message: `Invalid email format` });
    }
    
    if(req.body.password.length < 8)
        return res.status(400).send({ message: `Password must be atleast 8 characters long` });

    let { email, password } = req.body;
    return User.findOne({ email: email }).then(result => {
        if(result)
            return res.status(409).send({ message: `Duplicate email found` });
        
        let newUser = new User({
            email: email,
            password: bcrypt.hashSync(password, 10)
        });

        return newUser.save();
    })
    .then(registeredUser => res.status(201).send({
        message: "User registered successfully"
    }))
    .catch(err => errorHandler(err, req, res));

}

module.exports.loginUser = (req, res) => {

    if(!req.body.email.includes("@")){
        return res.status(400).send({ message: `Invalid email format` });
    }

    return User.findOne({ email: req.body.email }).then(user => {
        let {email, password} = req.body;
        
        if(!user) {
            return res.status(404).send({ message: `No email found` });
        }

        const isPasswordCorrect = bcrypt.compareSync(password, user.password);

        if(isPasswordCorrect) {
            return res.status(200).send({ 
                access: auth.createAccessToken(user) 
            })
        }
        else {
            return res.status(401).send({ message: `Incorrect email or password` });
        }
    })
    .catch(err => errorHandler(err, req, res));

};

module.exports.getProfile = (req, res) => {
    
    return User.findById( req.user.id )
    .select('-password')
    .then(user => {
        if(!user)
            return res.status(404).send({ message: `User not found` });

        user.password = '';
        return res.status(200).send({
            user: user
        });
    })
    .catch(err => errorHandler(err, req, res));
};