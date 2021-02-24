var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')

//Module to run the Queries in Database
var sql = require('./connection')

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

	console.log('\nQueries to run: ')
	queries.forEach( (element, indice) => {
		console.log( indice+1,') ',element.trim())
	})

	//A reduce is used to run all queries in array and accumulate the result of SELECT
	//	For while, the client just show the last table that it received, but the API return a table for each SELECT
	const outputForQueries = await queries.reduce( async (lastTable, el, ind) => {
		//Accumulator
		const previousTables = await lastTable;

		//It don't permite run more queries if a error happened
		if(previousTables.error){
			return previousTables
		}

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

				return { ...previousTables, error: {error: err, query: ind+1} }
			}

		} else {
			//Query for update or change the database
			try{
				const responseDB = await sql.queryToChangeDB(el);
				return previousTables
			} 
			catch(err) {
				console.log('ERROR UPDATE: ',err)
				return {...previousTables, error: {error: err, query: ind+1} }
			}

		}
	}, { table: [] })

	//After all, the API return to Client a JSON with the tables HTML for each SELECT e the errors
	res.send(outputForQueries)
})

app.listen( portServer,()=>console.log('Server running: http://localhost:'+portServer) )
