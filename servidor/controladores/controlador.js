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
    let sqlSinLimit = 'select count(*) as total from pelicula where 1 = 1';
    let params = [];
    let totalResultadosQuery;

    if (anio > 0) {
      sql += ' and anio = ?';
      sqlSinLimit += ' and anio = ?';
      params.push(anio);
    }
    if (titulo) {
      sql += ' and titulo like ?';
      sqlSinLimit += ' and titulo like ?';
      params.push(`%${titulo}%`);
    }
    if (genero_id > 0) {
        sql += ' and genero_id = ?';
        sqlSinLimit += ' and genero_id = ?';
        params.push(genero_id);
    }

    mySQL.query(sqlSinLimit, params, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        totalResultadosQuery=resultado[0].total;

    });//cierre query donde obtengo total de resultados

    if (columna_orden && tipo_orden) {
        sql += ` order by ${columna_orden} ${tipo_orden}`;
    }

    if (pagina && cantidad) {
        let offset=(cantidad*pagina) - cantidad;
        sql += ` limit ${offset}, ${cantidad}`;
    }

    mySQL.query(sql, params, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }

        var response = {
            'peliculas': resultado,
            'total': totalResultadosQuery
        };

        res.send(JSON.stringify(response));
    });//cierre query de las peliculas

}//cierre de función peliculas


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

function pelicupaPorId(req, res) {
    let idPelicula=req.params.idPelicula;
    let queryPelicula= `select * from pelicula where id = ${idPelicula}`;
    let queryRelacion= `select actor_id from actor_pelicula where pelicula_id = ${idPelicula}`;
    let queryActor= `select * from pelicula where id = ${idPelicula}`;
    console.log(idPelicula);

    mySQL.query(queryPelicula, function (error, resultado, fields) {  
        
        if(error){
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("La pelicula no existe");
        }
        console.log(resultado);

        mySQL.query(queryRelacion, function (error, resultado, fields) {  

            if(error){
                console.log("Error buscando en la tabla de relaciones, la pelicula existe en la tabla pelicula pero no en la de relaciones, posible inconsistencia", error.message);
                return res.status(404).send("Error inesperado en la consulta");
            }

            console.log(resultado);
            let listaDeActores = resultado.map(elemento => {return elemento.actor_id})
            res.send(listaDeActores)
        })

    })
}

module.exports = {
    peliculas: peliculas,
    generos: generos,
    pelicupaPorId: pelicupaPorId
};



