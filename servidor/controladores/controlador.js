var mySQL = require('../lib/conexionbd');

function peliculas(req, res) {

    console.log("Entrando en función peliculas");
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

    console.log("Entrando en función generos");
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

    console.log("Entrando en función pelicupaPorId");
    let idPelicula=req.params.idPelicula;
    let queryPelicula= `select * from pelicula where id = ${idPelicula}`;
    let queryRelacion= `select actor_id from actor_pelicula where pelicula_id = ${idPelicula}`;
    let queryActor= `select * from actor where 1=0`;
    let queryGenero= `select * from genero where id=`;

    let response={
        'pelicula': 0,
        'actores': 0,
        'genero': 0,
    }

    mySQL.query(queryPelicula, function (error, resultado, fields) {  
        
        if(error){
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("La pelicula no existe");
        }

        response.pelicula=resultado[0];
        queryGenero+=resultado[0].genero_id;
/////////////////////////////query para obtener actores////////////////////////////////////        
        mySQL.query(queryRelacion, function (error, resultado, fields) {  

            if(error){
                console.log("Error buscando en la tabla de relaciones, la pelicula existe en la tabla pelicula pero no en la de relaciones, posible inconsistencia", error.message);
                return res.status(500).send("Error inesperado en la consulta");
            }

            let listaDeActores = resultado.map(elemento => {
                queryActor+= ` or id=${elemento.actor_id}`;
                return elemento.actor_id})

            mySQL.query(queryActor, function (error, resultado, fields) {

                if(error){
                    console.log("Error buscando en la tabla de relaciones, la pelicula existe en la tabla pelicula pero no en la de relaciones, posible inconsistencia", error.message);
                    return res.status(500).send("Error inesperado en la consulta");
                }

                response.actores=resultado;
                
/////////////////////////////////query para obtener el genero/////////////////////////////////////////////////////////////
                mySQL.query(queryGenero, function (error, resultado, fields) {

                    if(error){
                        console.log("Error buscando en la tabla de relaciones, la pelicula existe en la tabla pelicula pero no en la de relaciones, posible inconsistencia", error.message);
                        return res.status(500).send("Error inesperado en la consulta");
                    }
        
        
                    response.genero=resultado[0].nombre;
        
                    console.log

                    res.send(JSON.stringify(response))
                })

              })


        })




    })
}


function recomendacion(req, res) {

    console.log("Entrando en función recomendacion");

    let anio_inicio=req.query.anio_inicio;
    let anio_fin=req.query.anio_fin;
    let puntuacion=req.query.puntuacion;
    let genero_id=req.query.genero;
    var querySQL='select * from pelicula where 1 = 0';
    var queryEjecutar='select * from pelicula where 1 = 1'; // por defecto esta query devuelve todas las peliculas, usada para opción "Cualquier" donde no se envía ni fecha ni puntaje 
    let params = [];

    if (anio_inicio > 0 && anio_fin > 0 && anio_inicio < anio_fin) {
        querySQL += ` or (anio between ${anio_inicio} and ${anio_fin})`;
        queryEjecutar=querySQL;
      }

    if(puntuacion > 0){
        querySQL += ` or puntuacion >= ${puntuacion}`;
        queryEjecutar=querySQL;
    }
      
    if (genero_id > 0) {
        queryEjecutar += ` and genero_id = ${genero_id}`;
      }
    console.log(queryEjecutar)

    mySQL.query(queryEjecutar, function(error, resultado, fields) {
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
    generos: generos,
    pelicupaPorId: pelicupaPorId,
    recomendacion: recomendacion
};



