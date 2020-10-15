const text = document.querySelector('[name=script-area]')
const output = document.querySelector('.output')

const errorArea = document.querySelector('.error-area ')
const errorsMessages = document.querySelector('.error-area > .errors')

const buttonCloseErrorLog = document.querySelector('.error-area svg')
toggleDisplayErrorLog = () => errorArea.style.display = 'none'
buttonCloseErrorLog.onclick = toggleDisplayErrorLog

toggleDisplayErrorLog()

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
		handleJson(a)	
	})
	.catch( e => console.error('ruim', e))
})

function handleJson(json){
	if(json.error){
		errorArea.style.display = 'block'	
		errorsMessages.innerHTML = json.error.error
	} else {
		errorsMessages.innerHTML = 'No errors'
	}

	if(json.table[json.table.length-1]){
		output.innerHTML = json.table[json.table.length-1]
	}
}

