//Referenced https://github.com/TarakeshS/protected-routes/blob/master/src/App.js
import Cookies from 'js-cookie';
const Auth = {
	
	verified: false,
	
	signout() {
		Cookies.remove('access_token');
	},
		
	async getAuth() {
		
		const token = Cookies.get('access_token')
		
	    await fetch('http://localhost:4000/verify', {
			method: 'GET',
			headers: {
			'Authorization': 'Bearer ' + token
				}	
		})
		.then(res => res.json({username:true}))
		.then(data => {
			this.verified = true;
			})
		.catch(err => { console.log(err);
			this.verified = false;});
			
		return this.verified;
	},
	
	async getUser() {
		
		const token = Cookies.get('access_token')
		
	    await fetch('http://localhost:4000/verify', {
			method: 'GET',
			headers: {
			'Authorization': 'Bearer ' + token
				}	
		})
		.then(res => res.json())
		.then(data => {
			return data.authorizedData.username;
			})
		.catch(err => { console.log(err)
			return "" });
	}
};

export default Auth;