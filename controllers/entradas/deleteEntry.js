const getDB = require("../../db");

const deleteEntry = async (req, res, next) => {

    let conexion;
    try{
        conexion = await getDB();
        const {id} = req.params;
        console.log(`esto es lo que recibo ${id}`);

        await conexion.query(`DELETE FROM usuarios WHERE id_usu = ?`,[id]);
        res.send({
            status: "ok",
            message: `La entrada con id ${id} fué borrado`,
          });
    } catch(error){
        next(error);
    } finally{
        if (conexion) conexion.release();
    }
    
}

module.exports = deleteEntry;
