var mySQL = require('../lib/conexionbd');

function peliculas(req, res) {

    let anio=req.query.anio;
    let titulo=req.query.titulo;
    let genero_id=req.query.genero;
    let columna_orden=req.query.columna_orden;
    let tipo_orden=req.query.tipo_orden;
    let pagina=req.query.pagina;
    let cantidad=req.query.cantidad;
    let sql = 'select * from pelicula where 1 = 1';
    let params = [];
    console.log(columna_orden);

    if (anio > 0) {
      sql += ' and anio = ?';
      params.push(anio);
    }
    if (titulo) {
      sql += ' and titulo like ?';
      params.push(`%${titulo}%`);
    }
    if (genero_id > 0) {
        sql += ' and genero_id = ?';
        params.push(genero_id);
    }
    if (columna_orden && tipo_orden) {
        sql += ` order by ${columna_orden} ${tipo_orden}`;
    }

    console.log(sql);
    console.log(params);


    mySQL.query(sql, params, function(error, resultado, fields) {
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


function generos(req, res) {

    var querySQL='select * from genero';

    mySQL.query(querySQL, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        var response = {
            'generos': resultado
        };

        res.send(JSON.stringify(response));
    });//cierre query de las peliculas

}

module.exports = {
    peliculas: peliculas,
    generos: generos
};