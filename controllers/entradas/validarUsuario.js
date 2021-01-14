const getDB = require("../../db");

const validateUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { registrationCode } = req.params;
    console.log(`El código de registro que viene es: ${registrationCode}`);
    // Comprobar que hay un usuario en la base de datos pendiente de validar con ese código
/*
    const [user] = await connection.query(
      `
      SELECT id_usu
      FROM usuarios
      WHERE codigoderegisto=?
    `,
      [registrationCode]
    );
*/
    // y si no lo hay dar un error
    /*if (user.length === 0) {
      const error = new Error(
        "No hay ningún usuario pendiente de validar con ese código"
      );
      error.httpStatus = 404;
      throw error;
    }*/

    // Activar el usuario y quitarle el registrationCode
    await connection.query(
      `
      UPDATE usuarios
      SET activado=true, codigoderegisto=NULL
      WHERE codigoderegisto=?;
    `,
      [registrationCode]
    );

    // Devolver una respuesta
    res.send({
      status: "ok",
      message: "Usuario validado",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = validateUser;