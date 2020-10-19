var sqlite = require('sqlite3')//.verbose()

var errors = null
var database = new sqlite.Database('./databases/example.db', 
    (err) => { if(err) errors=err} )

function createTable(array){

	//If the tables hasn't nothing
	if( !array[0]  ){
		return `
		<table>
			<tbody>
				<tr>
					<th>
					Table Empty
					</th>
				</tr>
			</tbody>
		</table>
		`
	}


	let table = '<table>'
	const columns = Object.keys(array[0])


	table += `<tr>`
	for(i in columns){
		table+=`<th>${columns[i]}</th>`
	}
	table += `</tr>`

	for(i in array){
		table += `<tr>`
		for(c of columns){
			table+=`<td>${array[i][c]}</td>`
		}
		table += `</tr>`
	}
	table+='</table>'

	return table
}

module.exports = {
    
    queryToChangeDB: function(queryToRun){
		return new Promise((resolve, reject)=> {
			let data = null
			let errors = null

			database.serialize(function(){
				//Queries inside this function serialize are run in sequence
				database.run(queryToRun,
				(err) => { 
					//If the bib didn't find any problemn running the query, 'err' is null
					if(err){ 
						errors= String( err ) //Return the error
						reject(errors)
					} else {
						data='Sucefful'
						resolve(data)
					}
				}
			)
			})
		})
    },

	queryToSelect: function(queryToRun){
		return new Promise((resolve, reject) => {
			let data = null
			let errors = null

			database.serialize(function(){
				//Queries inside this function serialize are run in sequence

				database.all(queryToRun,
				(err, result) => {
					//If the bib didn't find any problemn running the query, 'err' is null
					if(err){
						errors= String( err ) //Return the error
						reject(errors)
					} else {
						data=result
						resolve(createTable(data)) //Return a table HTML with the dades
					}
				})
			})
		})
    }
}
