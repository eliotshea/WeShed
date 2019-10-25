
const router = require('express').Router();
const TOKEN_KEY = require('../config/keys').TOKEN_SECRET;
const PASS_KEY = require('../config/keys').PASS_SECRET;
const SALT = require('../config/keys').SALT;
const connection = require('../mysql/mysql_setup'); //Grab the connection handle
const crypto = require('crypto');
const jwt = require('jsonwebtoken');



router.post('/add_song_to_playlist', (req, res) => {
	
	const pname = req.body.pname;
	const username = req.body.username;
	const msid = req.body.msid;
	
	console.log(pname, username, msid);
	
	connection.query('INSERT INTO Song_instances (Pname, Username, Msid) VALUES (?,?,?)'
		, [pname,username,msid], (err) => {
			if(err){
				console.log(err);
				res.json({success:false});
			}
			else{
				console.log("Success inserting " + username);
				res.json({success:true});
			}
		});
});


router.get('/get_songs', (req, res) => {
	connection.query('SELECT * FROM Master_songs', (err, results) => {
			if(err){
				console.log(err);
				res.send(err);
			}
			else{
				console.log(results);
				res.send(JSON.stringify(results));
			}
	});
});


//Referenced: https://codeshack.io/basic-login-system-nodejs-express-mysql/
router.post('/register', (req, res) => {
	
	const username = req.body.username;
	const FORMULA_KEY = username + PASS_KEY + SALT + username + SALT + SALT; //To ensure same passwords are stored w different vals
	const password = crypto.pbkdf2Sync(req.body.password, FORMULA_KEY, 100000, 64, 'sha512').toString('hex');
	const email = req.body.email;
	const fname = req.body.fname;
	const lname = req.body.lname;
	
	console.log(username, password, email, fname, lname);
	
	connection.query('INSERT INTO Users (Username, Password, Email, Fname, Lname) VALUES (?,?,?,?,?)'
		, [username,password,email,fname,lname], (err) => {
			if(err){
				console.log(err);
				res.json({success:false});
			}
			else{
				console.log("Success inserting " + username);
				res.json({success:true});
			}
		});
});


//Referenced: https://codeshack.io/basic-login-system-nodejs-express-mysql/
router.post('/auth', (req, res) => {
	
	const username = req.body.username;
	const FORMULA_KEY = username + PASS_KEY + SALT + username + SALT + SALT; //To ensure same passwords are stored w different vals
	const password = crypto.pbkdf2Sync(req.body.password, FORMULA_KEY, 100000, 64, 'sha512').toString('hex');
	
	console.log("\nreceived: " + username, password + '\n');
	
	if(username && password) {
		connection.query('SELECT * FROM Users WHERE Username = ? AND Password = ?', [username, password], (err, results, fields) => {
			if (results.length > 0) {
				//If all credentials are correct do this
				let token = jwt.sign({ username: username }, TOKEN_KEY, { expiresIn: 129600 }); // Creating token
				jwt.verify(token, TOKEN_KEY,  function(err, decoded) {
				console.log(decoded.username);
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
    jwt.verify(req.token, TOKEN_KEY, (err, authorizedData) => {
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