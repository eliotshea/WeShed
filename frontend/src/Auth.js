//Referenced https://github.com/TarakeshS/protected-routes/blob/master/src/App.js
const Auth = {
		
	signout() {
		localStorage.clear();
	},
		
	async getAuth() {
		
	    await fetch('http://localhost:4000/verify', {
			method: 'GET',
			headers: {
			'Authorization': 'Bearer ' + localStorage['acess_token']
				}	
		})
		.then(res => res.json())
		.then(data => {
			return true;
			})
		.catch(err => { console.log(err)
			return false });
	},
	
	async getUser() {
		
	    await fetch('http://localhost:4000/verify', {
			method: 'GET',
			headers: {
			'Authorization': 'Bearer ' + localStorage['acess_token']
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