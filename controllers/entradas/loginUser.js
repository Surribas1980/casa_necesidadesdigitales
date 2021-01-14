const jwt = require("jsonwebtoken");
const getDB = require("../../db");

const loginUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    // Recoger el email y password de req.body
    const { email, password } = req.body;

    // Si email o password están vacíos dar un error
    if (!email || !password) {
      const error = new Error("Faltan campos");
      error.httpStatus = 400;
      throw error;
    }

    // Seleccionar el usuario de la base de datos con ese email y password
    const [user] = await connection.query(
      `
      SELECT id_usu, role, activado
      FROM usuarios
      WHERE mail=? AND pwd=SHA2(?, 512)
    `,
      [email, password]
    );

    // Si no existe asumimos que el email o la pass son incorrectas y damos un error
    if (user.length === 0) {
      const error = new Error("El email o la password son incorrectos");
      error.httpStatus = 401;
      throw error;
    }

    // Si existe pero no está activo avisamos que está pendiente de activar
    if (!user[0].activado) {
      const error = new Error(
        "El usuario existe pero está pendiente de validar. Comprueba tu email."
      );
      error.httpStatus = 401;
      throw error;
    }

    // Asumimos que el login fue correcto

    // Creo el objecto de información que irá en el token
    const info = {
      id: user[0].id_usu,
      role: user[0].role,
    };

    const token = jwt.sign(info, process.env.SECRET, {
      expiresIn: "1d",
    });

    res.send({
      status: "ok",
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = loginUser;