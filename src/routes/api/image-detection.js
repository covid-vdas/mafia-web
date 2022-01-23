import http from 'http'

const fetch = async (uri) => {
	return new Promise(resolve => {
		http.get(uri, function(res){
			let body = ''
			res.on('data', function(chunk){
				body += chunk
			})
			res.on('end', function(){
				const json = JSON.parse(body)
				resolve(json)
			})
		})
	})
}

export const post = async (context) => {
	const images = []

	console.log(context)

	return {
		status: 200,
		body: images
	}
}