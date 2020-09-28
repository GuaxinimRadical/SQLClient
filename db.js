var sqlite = require('sqlite3')//.verbose()

var errors = null
var database = new sqlite.Database('example.db', 
    (err) => { if(err) errors=err} )

module.exports = {
    /* startDatabase: function(databaseName){
         let data = null
         let errors = null

         if(this.database){
             this.database.close()
         }
       
        
         return erros
     }, */

    queryToChangeDB: function(queryToRun){
        let data = null
        let errors = null

        database.serialize(function(){
            database.run(queryToRun)
        }, (err) => { if(err) errors=err})

        return errors
    },

	queryToSelect: function(queryToRun){
		return new Promise((resolve, reject) => {
			let data = null
			let errors = null

			database.serialize(function(){
				database.all(queryToRun,
				(err, result) => {
					if(err){
						errors = 'ERRO: '+err
						reject(errors)
					} else {
						data=result
						resolve(data)
					}
				})
			})
		})
    }
}
