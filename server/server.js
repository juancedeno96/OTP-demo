require("dotenv").config();

const express = require("express");
const crypto = require("crypto");

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const JWT_AUTH_TOKEN = process.env.JWT_AUTH_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;

const smsKey = process.env.SMS_SECRET_KEY;

const app = express();

app.use(express.json());
app.post("/sendOTP", (req, res) => {
  const phone = req.body.phone;
  const otp = Math.floor(100000 + Math.random() * 900000);
  const ttl = 2 * 60 * 1000;
  const expires = Date.now() + ttl;
  const data = `${phone}.${otp}.${expires}`;
  const hash = crypto.createHmac("sha256", smsKey).update(data).digest("hex");
  const fullhash = `${hash}.${expires}`;

  // client.messages.create({
  //     body: `Your one-time login password for CFM is ${otp}`,
  //     from: +12344054767,
  //     to: phone
  // }).then((messages)=> console.log(messages)).catch((err)=>console.error(err))
  res.status(200).send({ phone, hash: fullhash, otp });
});

app.post("/verifyOTP", (req, res) => {
  const phone = req.body.phone;
  const hash = req.body.hash;
  const otp = req.body.otp;
  let [hashValue, expires] = hash.split(".");

  let now = Date.now();

  if (now > parseInt(expires)) {
    return res.status(504).send({ msg: "Timeout Please Try Again" });
  }

  const data = `${phone}.${otp}.${expires}`;
  const newCalculatedHash = crypto
    .createHmac("sha256", smsKey)
    .update(data)
    .digest("hex");

  if (newCalculatedHash === hashValue) {
    return res.status(202).send({ msg: `user confirmed` });
  } else {
    return res.status(400).send({ verification: false, msg: `Incorrect OTP` });
  }
});

app.listen(4000);
