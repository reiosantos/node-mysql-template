import jwt from 'jsonwebtoken';
import express_jwt from 'express-jwt';
import { Request } from "express";

const getTokenFromHeaders = (req: Request) => {
  const { headers: { authorization } } = req;
  if (authorization && authorization.split(' ')[0].toLowerCase() === 'jwt') {
    return authorization.split(' ')[1];
  }
  return null;
};

export const auth = {
  required: express_jwt({
    secret: global.secretKey,
    userProperty: 'payload',
    algorithms: ['RS256'],
    getToken: getTokenFromHeaders
  }),
  optional: express_jwt({
    secret: global.secretKey,
    userProperty: 'payload',
    algorithms: ['RS256'],
    getToken: getTokenFromHeaders,
    credentialsRequired: false
  })
};
