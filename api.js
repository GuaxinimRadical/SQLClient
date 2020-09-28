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
	
	// sql.queryToChangeDB('CREATE TABLE example(id tinyInt)')
	//sql.queryToChangeDB('INSERT INTO panico(id, name) VALUES (3, "maria")')

	const hhh = sql.queryToSelect(queries[0])//queries[0])
	hhh.then(
		(a)=>{
			console.log('DJANGO: ',a)
			res.send(a)
		}
	).catch((erro)=>{
		res.send({'error': erro})
	})
})

app.listen( portServer,()=>console.log('Server running: http://localhost:'+portServer) )
