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
app.post('/query', async function(req, res){
	const queries = req.body.array
	// Example of const queries => ['SELECT * FROM DB', 'UPDATE ']

	console.log('Queries to run: ')
	queries.forEach( (element, indice) => {
		console.log( indice+1,') ',element.trim())
	})

	const outputForQueries = await queries.reduce( async (lastTable, el, ind) => {
		//Accumulator
		const previousTables = await lastTable;

		if(el.toLowerCase().includes('select')){
			//Query with select
			try{
				const responseDB = await sql.queryToSelect(el);
				const tableInHtml = await responseDB;

				return { ...previousTables, table: [...previousTables.table, tableInHtml] }
			}
			catch(err){
				console.log('ERROR SELECT: ',err)
				console.log({ table: [...previousTables.table], error: err })

				return { ...previousTables, error: err }
			}

		} else {
			//Query to Change DB
			//sql.queryToChangeDB(el)
			//	.then(e=>console.log('ChangeDone: ',e))
			//	.catch((err) => res.send({'errorDatabase': err}))
			try{
				const responseDB = await sql.queryToChangeDB(el);
				return previousTables
			} 
			catch(err) {
				console.log('ERROR UPDATE: ',err)
				return {...previousTables, error: err }  
			}
		}
	}, { table: [] })

	res.send(outputForQueries)
})

app.listen( portServer,()=>console.log('Server running: http://localhost:'+portServer) )
