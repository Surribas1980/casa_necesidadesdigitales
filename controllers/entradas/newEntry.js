const getDB = require("../../db");
const {generateRandomString,sendMail} = require("../../helpers");

const newEntry = async (req, res, next) => {
    let conexion;

    try{
        conexion = await getDB();
        
        const { nomFoto_usu, nomUsuario_usu, nom_usu, ape1_usu, ape2_usu, biografia_usu, dni_usu, mail,pwd } = req.body; 
          // Creo un código de registro (contraseña temporal de un solo uso)
        const registrationCode = generateRandomString(10);
        await conexion.query(
            `
            INSERT INTO usuarios (nomFoto_usu,nomUsuario_usu,nom_usu,ape1_usu,ape2_usu,biografia_usu,dni_usu,mail,pwd,codigoderegisto)
            VALUES (?,?,?,?,?,?,?,?,SHA2(?,512),?);
        `,[nomFoto_usu,nomUsuario_usu,nom_usu,ape1_usu,ape2_usu,biografia_usu,dni_usu,mail,pwd,registrationCode]);


            // ${process.env.PUBLIC_HOST}/users/validate/${registrationCode}
        const emailBody = `Te acabas de registrar en Servicios Digitales.
                            Pulsa en este link para verificar tu mail: ${process.env.PUBLIC_HOST}/validar/${registrationCode}`;

        await sendMail({
            to: mail,
            subject: 'Activa tu usuario de Servicios Digitales',
            body: emailBody,

        });

       
        res.send({
            menssage: "insertado?",
        });

    } catch(error){
        next(error);
    } finally {
        if (conexion) conexion.release();
    }
}

module.exports = newEntry;