
const router = require('express').Router();
const TOKEN_KEY = require('../config/keys').TOKEN_SECRET;
const PASS_KEY = require('../config/keys').PASS_SECRET;
const SALT = require('../config/keys').SALT;
const connection = require('../mysql/mysql_setup'); //Grab the connection handle
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


router.post('/get_challenges', (req, res) => {
	const mysql = "SELECT * FROM Challenges WHERE Challenges.To = ?";

	connection.query(mysql, [req.body.username], (err, results) => {
			if(err){
				console.log(err);
				res.send(err);
			}
			else{
				console.log(results);
				res.json(results);
			}
	});
});

router.post('/get_friends', (req, res) => {
	const mysql = "SELECT DISTINCT Username2 FROM Friendships WHERE Username = ?";

	connection.query(mysql, [req.body.username], (err, results) => {
			if(err){
				console.log(err);
				res.send(err);
			}
			else{
				console.log(results);
				res.json(results);
			}
	});
});

router.post('/add_challenge', (req, res) => {
	const mysql = 'INSERT INTO Challenges (Challenges.To, Challenges.From, Challenges.Message, Challenges.Plays) VALUES (?,?,?,?)';

	connection.query(mysql, [req.body.userchallenge, req.body.username, req.body.message, req.body.plays], (err, results) => {
			if(err){
				console.log(err);
			}
		});
});

router.post('/add_friend', (req, res) => {
	const mysql = 'INSERT INTO Friendships (Username, Username2) VALUES (?,?)';

	connection.query(mysql, [req.body.username, req.body.username2], (err, results) => {
			if(err){
				console.log(err);
			}
	});
});

router.post('/get_play_session_count', (req, res) => {
	const mysql = "SELECT COUNT(Date) as ps_count FROM Play_sessions WHERE Play_sessions.Username = ?";

	connection.query(mysql, [req.body.username], (err, results) => {
			if(err){
				console.log(err);
				res.send(err);
			}
			else{
				console.log(results);
				res.json(results);
			}
	});
});

router.post('/get_days_played', (req, res) => {
	const mysql = "SELECT DISTINCT COUNT(Date) as days_played FROM Play_sessions WHERE Play_sessions.Username = ?";

	connection.query(mysql, [req.body.username], (err, results) => {
			if(err){
				console.log(err);
				res.send(err);
			}
			else{
				console.log(results);
				res.json(results);
			}
	});
});

router.post('/get_streaks', (req, res) => {
	//Referenced https://jaxenter.com/10-sql-tricks-that-you-didnt-think-were-possible-125934.html for querying consecutive days
	const mysql = "WITH ps_dates AS (SELECT DISTINCT Date as ps_date FROM Play_sessions WHERE Username = ?),"
	+ " ps_date_groups AS ( SELECT ps_date, ps_date - row_number() OVER (ORDER BY ps_date) AS grp FROM ps_dates )"
	+ " SELECT min(ps_date) AS Psmin, max(ps_date) AS Psmax, max(ps_date) - min(ps_date) + 1 AS length FROM ps_date_groups GROUP BY grp ORDER BY length DESC";

	connection.query(mysql, [req.body.username], (err, results) => {
		if(err){
			console.log(err);
			results.send(err);
		}
		else{
			console.log(results);
			res.json(results);
		}
	});
});

//Global favorite song
router.get('/get_gfav_song', (req, res) => {
	const mysql = "SELECT * FROM (SELECT Msid, COUNT(Msid) as Max_count FROM Play_sessions GROUP BY Msid) as The_max"
	+ " INNER JOIN Master_songs ON Master_songs.Msid = The_max.Msid ORDER BY Max_count DESC LIMIT 1";

	connection.query(mysql, (err, results) => {
			if(err){
				console.log(err);
				res.send(err);
			}
			else{
				console.log(results);
				res.json(results);
			}
	});
});

//Global least played song
router.get('/get_gwor_song', (req, res) => {
	const mysql = "SELECT * FROM (SELECT Msid, COUNT(Msid) as Min_count FROM Play_sessions GROUP BY Msid) as The_min"
	+ " INNER JOIN Master_songs ON Master_songs.Msid = The_min.Msid ORDER BY Min_count LIMIT 1";

	connection.query(mysql, (err, results) => {
			if(err){
				console.log(err);
				res.send(err);
			}
			else{
				console.log(results);
				res.json(results);
			}
	});
});

router.post('/get_fav_song', (req, res) => {
	const mysql = "SELECT * FROM (SELECT Msid, COUNT(Msid) as Max_count FROM Play_sessions WHERE Play_sessions.Username = ? GROUP BY Msid) as The_max"
	+ " INNER JOIN Master_songs ON Master_songs.Msid = The_max.Msid ORDER BY Max_count DESC LIMIT 1";

	connection.query(mysql, [req.body.username], (err, results) => {
			if(err){
				console.log(err);
				res.send(err);
			}
			else{
				console.log(results);
				res.json(results);
			}
	});
});

router.post('/get_wor_song', (req, res) => {
	const mysql = "SELECT * FROM (SELECT Msid, COUNT(Msid) as Min_count FROM Play_sessions WHERE Play_sessions.Username = ? GROUP BY Msid) as The_min"
	+ " INNER JOIN Master_songs ON Master_songs.Msid = The_min.Msid ORDER BY Min_count LIMIT 1";

	connection.query(mysql, [req.body.username], (err, results) => {
			if(err){
				console.log(err);
				res.send(err);
			}
			else{
				console.log(results);
				res.json(results);
			}
	});
});

router.post('/get_history', (req, res) =>{
	const mysql = "select Master_songs.Name, Master_songs.Bt_ref, Master_songs.F_handle, Master_songs.Msid, results.Max_date, results.total FROM Master_songs INNER JOIN (select Play_sessions.Msid, MAX(Play_sessions.Date) as Max_date, SEC_TO_TIME(SUM(TIME_TO_SEC(Time_played))) As total FROM Play_sessions WHERE Username = ? group By Msid) AS results ON results.Msid = Master_songs.Msid order by total DESC";

	connection.query(mysql, [req.body.username], (err, results) => {
		if(err){
			console.log(err);
			res.send(err);
		} else {
			console.log(results);
			res.json(results);
		}
	});
});

router.post('/del_playlist', (req, res) => {
	connection.query('DELETE FROM Song_instances WHERE Song_instances.Username = ? AND Song_instances.Pname = ?', [req.body.username, req.body.pname], (err, results) => {
			if(err){
				console.log(err);
				res.json({success:false});
			}
			else{
				res.json({success:true});
			}
	});
});

router.post('/del_playlist_song', (req, res) => {
	connection.query('DELETE FROM Song_instances WHERE Song_instances.Siid = ?', [req.body.siid], (err, results) => {
			if(err){
				console.log(err);
				res.json({success:false});
			}
			else{
				res.json({success:true});
			}
	});
});

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

router.post('/get_playlists_songs', (req, res) => {

	//Get all of the users songs
	connection.query('SELECT * FROM Song_instances INNER JOIN Master_songs ON Song_instances.Msid = Master_songs.Msid WHERE Song_instances.Username = ? ORDER BY Pname',
					 [req.body.username], (err, results) => {
			if(err){
				console.log(err);
				res.send(err);
			}
			else{
				console.log(results);
				res.json(results);
			}
	});
});

router.post('/create_play_session', (req, res) => {
	const Msid = req.body.Msid;
	const Username = req.body.Username;
	const Time_played = req.body.Time_played;
	const currentDate = req.body.currentDate;

	console.log(Msid, Username, Time_played, currentDate)
	connection.query('INSERT INTO Play_sessions (Msid, Username, Time_played, Date) VALUES (?,?,?,?)',
		[Msid, Username, Time_played, currentDate], (err) => {
			if(err){
				console.log(err);
				res.json({success:false})
			}
			else {
				console.log("Success adding play session");
				res.json({success:true})
			}
		});
});

router.get('/get_songs', (req, res) => {
	connection.query('SELECT * FROM Master_songs', (err, results) => {
		if(err){
			console.log(err);
			results.send(err);
		}
		else{
			console.log(results);
			res.send(JSON.stringify(results));
		}
	});
});

router.get('/get_users', (req, res) => {
	connection.query('SELECT * FROM Users', (err, results) => {
		if(err){
			console.log(err);
			results.send(err);
		}
		else{
			console.log(results);
			res.send(JSON.stringify(results));
		}
	});
});

router.get('/get_usernames', (req, res) => {
	connection.query('SELECT DISTINCT Username AS Name FROM Users', (err, results) => {
		if(err){
			console.log(err);
			results.send(err);
		}
		else{
			console.log(results);
			res.send(JSON.stringify(results));
		}
	});
});

router.post('/get_user_stats', (req, res) => {
	connection.query('SELECT * FROM User_stats WHERE Username = ?', [req.body.Username], (err, results) =>{
		if(err){
			console.log(err);
			res.send(err);
		}else{
				console.log(results);
				res.send(JSON.stringify(results));
		}
	})
})

router.post('/get_user_play_sessions', (req, res) => {
	connection.query('SELECT CAST (Date AS CHAR) FROM Play_sessions WHERE Username = ? GROUP BY Date', [req.body.Username], (err, results) =>{
		if(err){
			console.log(err);
			res.send(err);
		}else{
			console.log(results);
			dateArray = [];
			for (var i in results) {
				dateArray.push(results[i]['CAST (Date AS CHAR)']);
			}
			console.log(dateArray);
			res.send(dateArray);
		}
	})
})


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

		connection.query('INSERT INTO User_stats (Username, Longest_streak, Current_streak, Favorite_song, Worst_song) VALUES (?, 0, 0, NULL, NULL)'
		, [username], (err) => {
			if(err){
				console.log(err);
			}
			else{
				console.log("Success inserting " + username);
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
