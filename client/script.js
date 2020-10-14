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
	.then( a => a.json())
	.then( a => {
		console.log(a)
		if(a.table){
			output.innerHTML = a.table[a.table.length-1]
		}
	})
	.catch( e => console.error('ruim', e))
})

const errorArea = document.querySelector('.error-area ')
const errorsMessages = document.querySelector('.error-area > .errors')

const buttonCloseErrorLog = document.querySelector('.error-area svg')
buttonCloseErrorLog.onclick = () => errorArea.style.display = 'none'