const sgMail = require('@sendgrid/mail');
const crypto = require("crypto");
sgMail.setApiKey('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');
//se manda como un objeto, y este ya lo desestructura en 'to','subject' y 'body'
async function sendMail({to,subject,body}){
    try{
            const msg = {
                    to,
                    from: process.env.SENDGRID_FROM, // Use the email address or domain you verified above
                    subject,
                    text: body,
                    html: `
                    <div>
                        <h1>${subject}</h1>
                        <p>${body}</p>
                    <strong>and easy to do anywhere, even with Node.js</strong>
                    </div>
                    `
                };
            await sgMail.send(msg);
    }catch(error){
        console.log(error)
        throw new Error("Error enviando mail");
    }
  

      
}

// Genera una cadena de caracteres aleatoria
function generateRandomString(length) {
    return crypto.randomBytes(length).toString("hex");
  }
module.exports = {
    sendMail,
    generateRandomString,
};