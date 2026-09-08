import { MongoClient } from "mongodb";
import "dotenv/config";

const dbName = "todo";
const client = new MongoClient(process.env.db_url);
export const collectionName = "todo_list";

export const connection = async () => {
    const connect = await client.connect();
    return await connect.db(dbName);
}