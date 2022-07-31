import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import * as userRepository from '../data/auth.js';

// 로그인 상태 확인
export const isAuth = async (req, res, next) => {
  const token = req.get('Accesstoken');
  if(!(token))
  {
    return res.status(401).json({"status" : "401"});
  }
  jwt.verify(
    token,
    config.jwt.secretKey,
    async (error, decoded) => {
      if (error) {
        return res.status(401).json({"status" : "401"});
      }
      const user = await userRepository.findById(decoded.id);
      if(!user) {
        return res.status(401).json({"status" : "401"});
      }
      req.admin = user.admin;
      req.userId = user.id;
      next();
    }
  )
}