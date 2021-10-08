
import app from "../index";
import request from "supertest";

describe('Get Items (Its Quantity and Expiry Date)', () => {
  it('It should get the total item Quantity and the ExpirY Date ', async () => {
     const itemName = "samsung"
    const res = await request(app)
      .get(`/${itemName}/quantity`)
      .set('Content-Type', 'application/json')
        console.log(res.body)
      expect(res.body.quantity).toBeTruthy()
      expect(res.body.validTill).toBeTruthy()
      expect(res.status).toEqual(200)

  }, 30000)
   it('It should return quantity to be equal 0 and ValidTill to be equal null if the item is not available', async () => {
    const itemName = "table"  //This item must not be available in the database
     const res = await request(app)
     .get(`/${itemName}/quantity`)
       .set('Content-Type', 'application/json')
      expect(res.status).toEqual(200)
         expect(res.body.quantity).toEqual(0)
      expect(res.body.validTill).toBeNull()
    
  }, 30000)
})

describe('Add Item', () => {
  it('It should post the item and return empty object', async () => {
     const itemName = "samsung"
     const quantity = 5
     const expiry = "1635783376000"
    const res = await request(app)
      .post(`/${itemName}/add`)
      .set('Content-Type', 'application/json')
      .send({
        quantity: quantity,
        expiry: expiry  
      })
      expect(res.status).toEqual(200)
      expect(res.body).toMatchObject({})
  }, 30000)
   it('It should return error if you post invalid quantity or invalid expiry date', async () => {
     const itemName = "samsung"
     const quantity = 0
     const expiry = "163578337600056"
     const res = await request(app)
      .post(`/${itemName}/add`)
      .set('Content-Type', 'application/json')
      .send({
        quantity: quantity,
        expiry: expiry  
      })
      expect(res.status).toEqual(400)
    
  }, 30000)
})

describe('Sell Item', () => {
  it('It should sell the item and return empty object', async () => {
     const itemName = "samsung"
     const quantity = 5
     const res = await request(app)
      .post(`/${itemName}/sell`)
      .set('Content-Type', 'application/json')
      .send({
        quantity: quantity
      })
      expect(res.status).toEqual(201)
      expect(res.body).toMatchObject({})
  }, 30000)
   it('It should return error if you post invalid quantity', async () => {
     const itemName = "samsung"
     const quantity = 0
     const res = await request(app)
      .post(`/${itemName}/sell`)
      .set('Content-Type', 'application/json')
      .send({
        quantity: quantity
      })
      expect(res.status).toEqual(400)
    
  }, 30000)
  it('It should return error if the quantity you want to sell is greater tahn the amount available', async () => {
    const itemName = "samsung"
    const quantity =  10000000000000
    const res = await request(app)
     .post(`/${itemName}/sell`)
     .set('Content-Type', 'application/json')
     .send({
       quantity: quantity
     })
     expect(res.status).toEqual(400)
   
 }, 30000)
})