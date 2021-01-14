const getDB = require("../../db");

const updateEntry = async (req, res, next) => {
    let conexion;

    try{
        conexion = await getDB();
        const {id} = req.params;

        await conexion.query(
            `
            UPDATE usuarios
            SET nomFoto_usu="[borrado]",nomUsuario_usu="[borrado]"
            WHERE id_usu=?
            `,
            [id]
            );

             // Devolvemos respuesta
        res.send({
            status: "ok",
            message: `El usuario con id: ${id} fue anonimizado`,
         });

    } catch(error){
        next(error);
    } finally {
        if (conexion) conexion.release();
    }

}

module.exports = updateEntry;