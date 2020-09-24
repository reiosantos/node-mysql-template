import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import {Model} from "sequelize";

export async function saveUser(user: Model) {
	const SALT_WORK_FACTOR = 10;
	// @ts-ignore
  if (!user.isNewRecord) return next();
	try {
		const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    // @ts-ignore
    user.password = await bcrypt.hash(user.password, salt);
	} catch (error) {
		throw Error(error);
	}
}

export function validatePassword(password: string) {
  // @ts-ignore
  return bcrypt.compare(password, this.password);
}

export function generateJWTToken() {
  const today = new Date();
  const expiry = new Date(today);

  expiry.setDate(today.getDate() + 2);
  return jwt.sign({
    // @ts-ignore
    id: this.id,
    // @ts-ignore
    exp: Number.parseInt(expiry.getTime() / 100, 10)
  }, global.secretKey);
}

export function toAuthJSON() {
  // @ts-ignore
  return { id: this.id, name: this.name, token: this.generateJWTToken()
  };
}
