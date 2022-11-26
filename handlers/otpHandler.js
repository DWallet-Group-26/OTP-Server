const unirest = require('unirest');

function otpHandler(phone, message) {
    console.log('Sending OTP', phone, message)

    var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");

    req.headers({
        "authorization": process.env.SMS_API_KEY
    });

    req.form({
        "message": message,
        "language": "english",
        "route": "q",
        "numbers": phone,
    });

    return new Promise((resolve, reject) => {
        req.end(function (res) {
            if (res.error) {
                reject(res.error);
            } else {
                resolve(res.body);
            }
        });
    });
}




module.exports = otpHandler;