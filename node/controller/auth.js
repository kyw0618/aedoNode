import * as authRepository from '../data/auth.js';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';
import request from 'request';
import { config } from '../config.js';
import { findAuthTerms } from '../data/app.js';

export async function singup(req, res) {
  const {phone, birth, name, terms, smsnumber}  = req.body;
  const admin = false;

  const findUserSms = await authRepository.findSms(phone);

  if (!findUserSms || smsnumber != findUserSms.number) {
    return res.status(401).json({"status": "401"});
  }

  const user = await authRepository.findByPhon(phone);
  if (user) {
    return res.status(401).json({"status": "401"});
  }

  var userid = await authRepository.saveUser( {
    phone,
    birth,
    name,
    admin,
    terms
    });
  
  const accessToken = createAccessJwt(userid);
  const refreshToken = createRefeshJwt(userid);
  
  await authRepository.saveToken(userid, refreshToken);
  res.status(201).json({"status": "201", "Accesstoken": accessToken, userId: userid});
}

export async function login(req, res) {
  const {phone, smsnumber} = req.body;
  const user = await authRepository.findByPhon(phone);

  if (!user) {
    return res.status(403).json({status : '403'});
  }

  const dbSmsNumber = await authRepository.findSms(phone);

  if (smsnumber != dbSmsNumber.number) {
    return res.status(401).json({status: "401"});
  }

  const accessToken = createAccessJwt(user.id);
  const newRefreshToken = createRefeshJwt(user.id);
  const checkRefreshToken = await authRepository.updateRefreshToken(user.id, newRefreshToken);
  if (!checkRefreshToken) {
    await authRepository.saveToken(user.id, newRefreshToken);
  }
  return res.status(200).json({"status": "200", "Accesstoken": accessToken, userId: user.id});
}

export async function getUserInfo(req, res) {
  const user = await authRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({"status": "404"})
  }
  res.status(200).json({"status": "200", user})
}

export async function autoLogin(req, res) {
  try {
    var userId = tokenparsing(req.get('Accesstoken'));
    var findrefreshToken = await authRepository.findRefreshToken(userId);
  } catch {
    return res.status(404).json({"status": "404"});
  }
  
  const accessToken = verifytoken(req.get('Accesstoken'));
  const refreshToken = verifytoken(findrefreshToken);
  const newAccessToken = createAccessJwt(userId);
  const newRefreshToken = createRefeshJwt(userId);
  
  if (accessToken === 'invalid') {
    return res.status(401).json({"status": "401"});
  }
  
  // access token, refresh token 만료
  if ((accessToken === null) && (refreshToken === null)) {
    return res.status(401).json({"status": "401"});
  }
  
  await authRepository.updateRefreshToken(userId, newRefreshToken);
  return res.status(200).json({"status": "200", "Accesstoken": newAccessToken});
}


export async function logout(req, res) {
  await authRepository.deleteRefreshToken(req.userId);
  
  res.status(204).json({"status": "204"});
}

export async function getAuthTerms(req, res) {
  const terms = await findAuthTerms();
  res.status(200).json({"status": "200", terms})
}


export async function sendsms (req, res) {
  const userphone = req.body.phone;
  const user_auth_number = Math.floor(Math.random() * 8999) + 1000; // 인증번호
  send_message(userphone, user_auth_number);
  const tmp = await authRepository.smsExists(userphone);
  if (!tmp) {
    await authRepository.saveSms(userphone, user_auth_number);
  } else {
    await authRepository.updateSms(userphone, user_auth_number);
  }
  res.status(201).json({"status": "201"});
}

export function createAccessJwt(id) {
  return jwt.sign({id}, config.jwt.secretKey, { expiresIn: config.jwt.expiresInAccess});
}

export function createRefeshJwt(id) {
  return jwt.sign({id}, config.jwt.secretKey, { expiresIn: config.jwt.expiresInRefresh});
}

function verifytoken(token) {
  try {
    return jwt.verify(token, config.jwt.secretKey);  
  } catch (err) {
    if (err.message === 'invalid signature') {
      return 'invalid';
    }
    return null;
  }
}

function tokenparsing(token) {
  const base64Payload = token.split('.')[1];
  const payload = Buffer.from(base64Payload, 'base64');
  const result = JSON.parse(payload.toString())
  return result.id
}

function send_message(userPhone, authNumber) {
  var user_phone_number = userPhone;//수신 전화번호 기입
  var resultCode = 404;
  const date = Date.now().toString();
  const uri = config.sms.serviceId; //서비스 ID
  const secretKey = config.sms.secretKey;// Secret Key
  const accessKey = config.sms.ncpkey;//Access Key
  const method = "POST";
  const space = " ";
  const newLine = "\n";
  const url = `https://sens.apigw.ntruss.com/sms/v2/services/${uri}/messages`;
  const url2 = `/sms/v2/services/${uri}/messages`;
  const hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256, secretKey);
  hmac.update(method);
  hmac.update(space);
  hmac.update(url2);
  hmac.update(newLine);
  hmac.update(date);
  hmac.update(newLine);
  hmac.update(accessKey);
  const hash = hmac.finalize();
  const signature = hash.toString(CryptoJS.enc.Base64);
  request({
    method: method,
    json: true,
    uri: url,
    headers: {
      "Contenc-type": "application/json; charset=utf-8",
      "x-ncp-iam-access-key": accessKey,
      "x-ncp-apigw-timestamp": date,
      "x-ncp-apigw-signature-v2": signature,
    },
    body: {
      type: "SMS",
      countryCode: "82",
      from: config.sms.fromNumber, //"발신번호기입"
      content: `애도 어플 인증번호 ${authNumber} 입니다.`,//문자내용 기입
      messages: [
        { 
          'to': `${user_phone_number}`
        }
      ]
    },
  },
  function (err, res, html) {
    if (err) console.log(err);
    else { resultCode = 200; console.log(html); }
  }
  );
  return resultCode;
}

/**
 * Admin 
 */
export async function adminGetUser(req, res) {
  if (req.admin == false) {
    return res.status(403).json({"status": "403"});
  }
  const value = req.query.value;
  const result = await ( value
    ? authRepository.adminfindUser(value)
    : authRepository.findAllUser());
  res.status(200).json({"status": "200", result});
}