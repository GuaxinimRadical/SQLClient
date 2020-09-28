    const text = document.querySelector('[name=script-area]')
	const output = document.querySelector('.output')
	
	const button-run = document.getElementsByClassName('button-run')[0]
	button-run.addEventListener('click', ()=>{

		let query = text.value 
		query = query.split(';').filter( i=>i  )
		console.log('Comandos setados: ',query)

		const urlApi = 'http://localhost:8008/query'
		fetch(urlApi, {
			headers: {
				//  'Accept': 'application/json, text/plain, */*',
				 'Content-Type': 'application/json'
			},
			method: "POST", 
			body: JSON.stringify({array: query})  
			}
		)
		.then((a)=>a.json())
		.then((a)=>console.log(a))
		.catch((e)=>console.log('ruim', e))
	})

