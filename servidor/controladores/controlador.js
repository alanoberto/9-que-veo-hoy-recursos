var mySQL = require('../lib/conexionbd');

function peliculas(req, res) {

    var querySQL='select * from pelicula';
    mySQL.query(querySQL, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        var response = {
            'peliculas': resultado
        };

        res.send(JSON.stringify(response));
    });//cierre query de las peliculas

}

module.exports = {
    peliculas: peliculas,
};