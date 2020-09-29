const text = document.querySelector('[name=script-area]')
const output = document.querySelector('.output')

const buttonRun = document.getElementsByClassName('button-run')[0]
buttonRun.addEventListener('click', ()=>{
	let query = text.value 
	query = query.split(';').filter( i=>i.trim() )
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
	.then((a)=>{
		console.log(a)
		if(a.table.includes('table')){
			output.innerHTML = a.table	
		}
	})
	.catch((e)=>console.error('ruim', e))
})

