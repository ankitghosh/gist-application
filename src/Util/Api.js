const ApiRequest = (options) => {
	let base_url = 'https://api.github.com/'+options.url
	return new Promise((resolve, reject)=>{
		fetch(base_url)
		  	.then(
			    function(response) {
			      	if (response.status !== 200) {
			        	console.log('Looks like there was a problem. Status Code: ' +
			          		response.status);
			        	return;
			      	}
			      	response.json().then(function(data) {
			        	resolve(data)
			      	});
			    }
		  	)
		  	.catch(function(err) {
		  		reject(err);
		    	console.log('Fetch Error :-S', err);
		  	});
		});
	
}

export default ApiRequest;