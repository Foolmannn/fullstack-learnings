import { channel } from "diagnostics_channel";
import mongoose  from "mongoose";
import { clonePageVaryPathWithNewSearchParams } from "next/dist/client/components/segment-cache/vary-path";
import { buffer } from "stream/consumers";

const MONGODB_URI = process.env.MONGODB_URI! // ! means that this variable exist and will be provided 

if(!MONGODB_URI){
    throw new Error("Please defind the mongodb uri in env file ")
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn: null, promise: null}
}

export async function connectToDatabase(){
    if(cached.conn){
        return cached.conn
    }
    if(!cached.promise){
        const opts = {
            bufferCommands:true,
            maxPoolSize : 10
        }
        cached.promise = mongoose.connect(MONGODB_URI,opts).then(()=>mongoose.connection)
    }
    try{
        cached.conn = await cached.promise
    }catch(error){
        cached.promise = null
        throw new Error('Error in MongoDb')
        throw error
    }

    return cached.conn
    
}