var sqlite = require('sqlite3')//.verbose()

var errors = null
var database = new sqlite.Database('./databases/example.db', 
    (err) => { if(err) errors=err} )

function createTable(array){
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
				database.run(queryToRun,
				(err) => { 
					if(err){ 
						errors= String( err )
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
				database.all(queryToRun,
				(err, result) => {
					if(err){
						errors= String( err )
						reject(errors)
					} else {
						data=result
						resolve(createTable(data))
					}
				})
			})
		})
    }
}
