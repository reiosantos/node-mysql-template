import passport from 'passport';
import LocalStrategy from 'passport-local';
import ModelWrapper from '../models';
import { MODELS } from "@san/constants";
import {Op} from "sequelize";
import logger from "@san/util/logger";

export const localStrategy = new LocalStrategy.Strategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false
}, async (username: string, password: string, next: Function) => {
  const userM = ModelWrapper.getModel(MODELS.USER);
  try {
    const user = await userM.findOne({ where: { [Op.or]: [{'username': username}, {'email': username}] } });
    if (!user) {
      return next(null, false, {
        isError: true,
        data: null,
        error: 'username or password is invalid'
      });
    }

    const isValid = await user.validatePassword(password);

    if (isValid) {
      return next(null, user);
    }
    return next(null, false, {
      isError: true,
      data: null,
      error: 'username or password is invalid'
    });
  } catch (err) {
    logger.error(err.message)
    return next(null, false, {
      isError: true,
      data: null,
      error: err.message || err
    });
  }
});

passport.use(localStrategy);
