import { Collection, MongoClient } from "mongodb";
import bcrypt from "bcrypt";


interface ICredentialsDocument {
    _id: string;
    password: string;
}

interface IUsersDocument {
    _id: string;
}

export class CredentialsProvider {
    private readonly userCredsCollection: Collection<ICredentialsDocument>;
    private readonly usersCollection: Collection<IUsersDocument>;


    constructor(mongoClient: MongoClient) {
        const USER_CREDS_COLLECTION = process.env.CREDS_COLLECTION_NAME;
        const USERS_COLLECTION = process.env.USERS_COLLECTION_NAME;

        if (!USER_CREDS_COLLECTION && !USERS_COLLECTION) {
            throw new Error("Missing USER_CRED_COLLECTION and USERS_COLLECTION from env file")
        }

        if (!USER_CREDS_COLLECTION) {
            throw new Error("Missing USER_CRED_COLLECTION from env file");
        }

        if (!USERS_COLLECTION) {
            throw new Error("Missing USERS_COLLECTION from env file");
        }

        this.userCredsCollection = mongoClient.db().collection<ICredentialsDocument>(USER_CREDS_COLLECTION);
        this.usersCollection = mongoClient.db().collection<IUsersDocument>(USERS_COLLECTION);

    }

    //returns false if username already exists
    //returns true after adding user to database
    async registerUser(email: string, plaintextPassword: string) {

        const _id = email;
        //if user already exists in users collection return false
        if (await this.usersCollection.findOne({ _id }) !== null) {
            return false;
        }

        //generate salt
        const salt = await bcrypt.genSalt(10);
        //generate hashed password from plaintext password and salt
        const hashedPassword = await bcrypt.hash(plaintextPassword, salt)

        console.log(`salt: ${salt}`)
        console.log(`hashpswd: ${hashedPassword}`)

        //insert user into users and user creds collections
        await this.usersCollection.insertOne({ _id })
        await this.userCredsCollection.insertOne({ _id, password: hashedPassword })
        return true;
    }

    //returns false if there is no user in collection or there is no match
    //returns true if plaintext password matches the stored hashed password
    async verifyPassword(email: string, plaintextPassword: string) {
        // Find the user by email
        const _id = email;
        const user = await this.userCredsCollection.findOne({ _id });
        //if no user in collection return false
        if (user === null) {
            return false;
        }

        //verifty plaintext password matches the stored hashed password
        const match = await bcrypt.compare(plaintextPassword, user.password);
        //return result of comparison
        return match;
    }
}
