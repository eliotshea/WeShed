//Referenced https://github.com/TarakeshS/protected-routes/blob/master/src/App.js
import Cookies from 'js-cookie';
const Auth = {
	username: " ",
	verified: false,
	
	signout() {
		this.verified = false;
		Cookies.remove('mytoken');
	},
		
	getAuth() {
		
		const token = Cookies.get('mytoken')
		
	    fetch('http://localhost:4000/verify', {
			method: 'GET',
			headers: {
			'Authorization': 'Bearer ' + token
				}	
		})
		.then(res => res.json())
		.then(data => {
			this.verified = true;
			})
		.catch(err => { console.log(err);
			this.verified = false;});
			
		return this.verified;
	},
	
	async getUser() {
		
		const token = Cookies.get('mytoken')
		
	    await fetch('http://localhost:4000/verify', {
			method: 'GET',
			headers: {
			'Authorization': 'Bearer ' + token
				}	
		})
		.then(res => res.json())
		.then(data => {
			this.username = data.authorizedData.username;
			})
		.catch(err => { console.log(err) });
		return this.username;
	}
};

export default Auth;