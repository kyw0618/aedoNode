import dotenv from 'dotenv';
dotenv.config();

export const config = {
  jwt: {
    secretKey: process.env.JWT_SECRET,
    expiresInAccess: process.env.JWT_EXPIRES_SEC_ACCESS,
    expiresInRefresh: process.env.JWT_EXPIRES_SEC_REFRESH
  },
  db: {
    host: process.env.DB_HOST,
    img: process.env.IMG_ROOT
  },
  import: {
    id: process.env.IMPORT_ID,
    key: process.env.IMPORT_API_KEY,
    secretKey: process.env.IMPORT_SECRET_KEY
  },
  sms: {
    ncpkey: process.env.NCP_KEY,
    secretKey: process.env.NCP_SECRET_KEY,
    serviceId: process.env.SERVICE_ID,
    fromNumber: process.env.SMS_FROM
  },
  port: parseInt(process.env.HOST_PORT)
  }