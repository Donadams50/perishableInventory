import { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import { Item } from "../models/items";
import * as schedule from "node-schedule";
import { sequelize } from "../sequelize";

// Add new item
export async function addNewItem( req: Request, res: Response): Promise<Response> {
  let transaction = await sequelize.transaction();
  try {
     //start a new transaction
     const  quantity= req.body.quantity
     const  expiry = req.body.expiry
     const  itemName =req.params.name.toLowerCase()
     const item = {
        quantity:req.body.quantity,
        expiry :req.body.expiry,
        itemName :req.params.name.toLowerCase()
     }
      const isItemEXist = await Item.findOne({  where: { itemName: itemName, expiry : expiry }});
   
      if (isItemEXist) {
        const newQuantity = quantity + isItemEXist.quantity
        const itemId = isItemEXist.id
        const checkOut = await Item.update({ quantity : newQuantity } , {where :{ id: itemId}, } )
      } else {
        const saveditem = await Item.create({ ...item, },    { transaction });
      }
      await transaction.commit();
      return res.status(200).send({});
      }
    
  catch (error) {
    if (transaction) {
      await transaction.rollback();
    }
    return res.status(400).send({
      message: "Error while adding new item",
    });
  }
}

// Get items
export async function getItems(req: Request, res: Response): Promise<Response> {
  try {
    const itemName = req.params.name.toLowerCase();
    const currentDateSinceEpoch = Date.now();
    const unexpiredItems = await Item.findAll({
      attributes: [
        [Sequelize.fn("sum", Sequelize.col("quantity")), "quantity"],
        [Sequelize.fn("min", Sequelize.col("expiry")), "validTill"],
      ],
      where: {
        itemName: itemName,
        expiry: { [Op.gt]: currentDateSinceEpoch },
        quantity: { [Op.gt]: 0 },
      },
    });
    if (unexpiredItems[0].quantity > 0) {
      return res.status(200).send(unexpiredItems[0].toJSON());
    } else {
      return res.status(200).send({ quantity: 0, validTill: null });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error while getting new item",
    });
  }
}

//sell an item
export async function selltem(req: Request, res: Response): Promise<Response> {
  try {
    const itemName = req.params.name.toLowerCase();
    const itemQuantityRequestedToBeSold = req.body.quantity;
    const currentDateSinceEpoch = Date.now();

    const unexpiredItemsCount = await Item.findAll({
      attributes: [
        [
          Sequelize.fn("sum", Sequelize.col("quantity")),
          "quantityOfNonExpired",
        ],
      ],
      raw: true,

      where: {
        itemName: itemName,
        expiry: { [Op.gt]: currentDateSinceEpoch },
      },
    });
     

    if (unexpiredItemsCount[0].quantityOfNonExpired != 0) {
      const quantityNonExpiredAvailableToBeSold = unexpiredItemsCount[0].quantityOfNonExpired;
      if (  quantityNonExpiredAvailableToBeSold >= itemQuantityRequestedToBeSold ) {
        const makeSales = await sequelize.query(
          "update items it join( select * from( select *, case when cumulsum <= TotalRequiredQuantity then 0 else cumulsum-TotalRequiredQuantity end NewQuantity from(select *, " +
            itemQuantityRequestedToBeSold +
            ' TotalRequiredQuantity, sum(quantity) over(partition by itemName order by expiry) cumulsum from items where itemName = "' +
            itemName +
            '" AND expiry > "' +
            currentDateSinceEpoch +
            '" AND quantity > 0 )q )q1  where quantity>=NewQuantity)cte on it.id=cte.id  set it.quantity = NewQuantity'
        );
        // console.log(makeSales);
        if (makeSales) {
          return res.status(201).send({});
        } else {
          return res.status(400).send({
            message: "Error while selling item",
          });
        }
      } else {
        return res.status(400).send({
          quantityRequestedToBeSold: itemQuantityRequestedToBeSold,
          quantityNonExpiredAvailableToBeSold: quantityNonExpiredAvailableToBeSold,
          message: "The quantity of non expired available to be sold is less than the quantity requested to be sold",
        });
      }
    } else {
      return res.status(400).send({
        quantityRequestedToBeSold: itemQuantityRequestedToBeSold,
        quantityNonExpiredAvailableToBeSold: 0,
        message: "Item not available",
      });
    }
  } catch (error) {
    return res.status(400).send({
      message: "Error while selling item",
    });
  }
}

// job that delete expired item periodically runs every 6 hours
schedule.scheduleJob("0 0 */6 * * *", async () => {
  const currentDateSinceEpoch = Date.now();
  try {
    const deleteCart = await Item.destroy({
      where: { expiry: { [Op.lte]: currentDateSinceEpoch } },
    });
    console.log(currentDateSinceEpoch);
  } catch (err) {
    return err;
  }
});

// delete item with 0 quantity based on my sell api
schedule.scheduleJob("0 0 */1 * * *", async () => {

  const currentDateSinceEpoch = Date.now();
  try {
    const deletePurchasedItem = await Item.destroy({
      where: { quantity: 0 },
    });
    console.log(deletePurchasedItem);
  } catch (err) {
    return err;
  }
});
