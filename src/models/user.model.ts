import {generateJWTToken, saveUser, toAuthJSON, validatePassword} from "@san/helpers/model.helpers";
import * as Sequelize from 'sequelize';
import DBClient from "@san/config/database";

export interface UserAttributes {
  id?: number;
  firstName?: string;
  lastName?: string | null;
  contact?: string | null;
  email?: string;
  dateRegistered?: Date;
  isAdmin?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  name?: string;
}

// some fields are optional at creation like ID
interface UserCreationAttributes extends Sequelize.Optional<UserAttributes, "id"> {}

class UserModel extends Sequelize.Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number; // Note that the `null assertion` `!` is required in strict mode.
  public firstName!: string;
  public lastName!: string | null; // for nullable fields
  public contact!: string | null; // for nullable fields
  public email!: string;
  public dateRegistered!: Date;
  public isAdmin!: boolean;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public readonly name!: string;

  // instance methods
  validatePassword!: (password: string) => Promise<boolean>;
  generateJWTToken!: () => string;
  toAuthJSON!: () => { name: any; id: any; token: any };
}

UserModel.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      field: 'id'
    },
    createdAt: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false
    },
    firstName: {
      type: new Sequelize.DataTypes.STRING(128),
      allowNull: false,
    },
    lastName: {
      type: new Sequelize.DataTypes.STRING(128),
      allowNull: true,
    },
    contact: {
      type: new Sequelize.DataTypes.STRING(128),
      allowNull: true,
    },
    email: {
      type: new Sequelize.DataTypes.STRING(128),
      allowNull: false,
      unique: 'UN_user_email_id'
    },
    dateRegistered: {
      type: Sequelize.DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW
    },
    // Virtual Columns
    name: {
      type: Sequelize.VIRTUAL,
      get () { return `${this.firstName} ${this.lastName}`; }
    }
  },
  {
    modelName: 'user',
    timestamps: true,
    updatedAt: 'updatedAt',
    createdAt: 'createdAt',
    underscored: true,
    freezeTableName: true,
    tableName: "users",
    sequelize: DBClient.db.sequelize, // passing the `sequelize` instance is required
  }
);

UserModel.beforeCreate(saveUser)
// instance methods
UserModel.prototype.validatePassword = validatePassword;
UserModel.prototype.generateJWTToken = generateJWTToken;
UserModel.prototype.toAuthJSON = toAuthJSON;

export default UserModel;
