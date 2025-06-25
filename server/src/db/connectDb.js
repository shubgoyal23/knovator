import Mongoose from "mongoose";
let isDbConnected = false

export default async function(){
    if (isDbConnected) return
    try {
        const connectin = await Mongoose.connect(`${process.env.MONGODB_URI}/${process.env.MONGODB_NAME}`)
        if (connectin.connection.host){
            isDbConnected = true
        }
    } catch (error) {
        console.log(error)
    }
}