const sgmail=require('@sendgrid/mail')
require('dotenv').config()
sgmail.setApiKey(process.env.API_KEY)

const sendWelcomeEmail =(email,name)=>{
    sgmail.send({
        to:email,
        from:'kartikeyamani0724@gmail.com',
        subject:'Welcome to task app',
        text:`Hi ${name} Task app team welcomes you to your new account`
    })
}
const sendcancellationEmail=async (email,name)=>{
    sgmail.send({
        to:email,
        from:'kartikeyamani0724@gmail.com',
        subject:`Sorry for the inconvenience ${name} `,
        text:`Sorry for the inconvenience created Mr/Mrs ${name} Feel free to send your feedback to Us.`
    })
}

module.exports={
    sendWelcomeEmail,
    sendcancellationEmail
}