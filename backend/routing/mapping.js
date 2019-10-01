
const router = require('express').Router();
const SECRET_KEY = require('../config/token_key').TOKEN_SECRET;
const connection = require('../mysql/mysql_setup'); //Grab the connection handle
const path = require('path');
const jwt = require('jsonwebtoken');



//Referenced: https://codeshack.io/basic-login-system-nodejs-express-mysql/
router.post('/auth', (req, res) => {
	const username = req.body.username;
	const password = req.body.password;
	
	console.log("received: " + username, password);
	
	if(username && password) {
		connection.query('SELECT * FROM Users WHERE Username = ? AND Password = ?', [username, password], (err, results, fields) => {
			if (results.length > 0) {
				//If all credentials are correct do this
				let token = jwt.sign({ username: username }, SECRET_KEY, { expiresIn: 129600 }); // Sigining the token
				jwt.verify(token, SECRET_KEY,  function(err, decoded) {
				console.log(decoded.username, decoded.id) // bar
				});
				console.log('token: '+ token);
				res.json({
					success: true,
					err: null,
					token
				});
			} else{
				//res.json and res.send are very similar, it just sends the data back
				res.status(401).json({
					success: false,
					token: null,
					err: 'Username or password is incorrect'
				});
				
			  }
		});
	}
});



//Check to make sure header is not undefined, if so, return Forbidden (403)
const checkToken = (req, res, next) => {
    const header = req.headers['authorization'];
	console.log("header: " + header + "\n");
    if(typeof header !== 'undefined') {
        const bearer = header.split(' ');
        const token = bearer[1];

        req.token = token;
        next();
    } else {
        //If header is undefined return Forbidden (403)
        res.sendStatus(403)
    }
}

//This is a protected route
//Referenced https://medium.com/@maison.moa/using-jwt-json-web-tokens-to-authorize-users-and-protect-api-routes-3e04a1453c3e
router.get('/verify', checkToken, (req, res) => {
	console.log('\nreached /verify\n');
	console.log(req.token);
    //verify the JWT token generated for the user
    jwt.verify(req.token, SECRET_KEY, (err, authorizedData) => {
        if(err){
            //If error send Forbidden (403)
                console.log('ERROR: Could not connect to the protected route');
                res.sendStatus(403);
            } else {
                //If token is successfully verified, we can send the authorized data
                res.json({
                    message: 'Successful log in, token is symmetric',
                    authorizedData
                });
                console.log('SUCCESS: Connected to protected route');
            }
        })
});



//Expose the routing to the app
module.exports = router;