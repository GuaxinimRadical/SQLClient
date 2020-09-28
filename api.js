var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')

var sql = require('./db')

//Express
const app = express()
const portServer = 8008

//Configuration of Body-Parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Client
app.use(express.static(__dirname+'/client'))
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname+'/client/index.html'))
})

//Database
app.post('/query', function(req, res){
	const queries = req.body.array
	// Example of const queries => ['SELECT * FROM DB', 'UPDATE ']

	console.log('Queries to run: ')
	queries.forEach( (element, indice) => {
		console.log( indice+1,') ',element)
	})
	
	queries.forEach( (el,ind) => {
		if(el.toLowerCase().includes('select')){
			//Query with select
			sql.queryToSelect(el)
				.then( response => res.send(response))
				.catch((err) => res.send({'error': err}))
		} else {
			 sql.queryToChangeDB(el)
		}
	})

	const queriesWithSelect = queries.filter( el => el.toLowerCase().includes('select') ) 
	const queriesToChangeDB = queries.filter( el => (!el.toLowerCase().includes('select') && el ))//.filter( i=>i ) 

})

app.listen( portServer,()=>console.log('Server running: http://localhost:'+portServer) )
