import { Request,Response } from "express";
import { AdSubscriptionPayment } from "../models/AdSubscriptionPayment";
import { Advertiser } from "../models/Advertiser";


export class PaymentController{
    static async getPaymentsByAdvertiserId(req:Request,res:Response){
        const id = 1
    

        try{
        const payments = await AdSubscriptionPayment.findAll({include:[
            {
                model:Advertiser,
                as:'advertiser',
                where:{
                    userId:id
                }
            }
        ]})
        res.json(payments)
    }catch(error){
        console.error(error)
        res.status(500).json(error)
    }
}
    static async getAllPayments(req:Request,res:Response){
        

        try{
        const payments = await AdSubscriptionPayment.findAll()
        res.json(payments)
    }catch(error){
        console.error(error)
        res.status(500).json(error)
    }
}
}