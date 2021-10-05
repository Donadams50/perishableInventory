import { Model, DataTypes, BuildOptions } from "sequelize";
import { sequelize } from "../sequelize";

//  Declare an interface for our model that is basically what our class would be
interface MyModel extends Model {
  readonly id: number;
  quantity: number;
  itemName: string;
  expiry: number;
  quantityOfNonExpired: number;
  nextDateToExpire: number
};

// Declare the static model so `findOne` etc. use correct types.
type MyModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): MyModel;
};

// TS can't derive a proper class definition from a `.define` call, therefor we need to cast here.
export const Item = <MyModelStatic>sequelize.define("item", {
  id: {
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER.UNSIGNED,
  },

  quantity: DataTypes.DOUBLE,
  itemName: DataTypes.STRING,
  expiry: DataTypes.DOUBLE,
});
 