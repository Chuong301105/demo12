const { MongoClient } = require('mongodb');

async function run() {
    const uri = 'mongodb://localhost:27017'; // MongoDB server URI

    const client = new MongoClient(uri);

    try {
        // Connect to MongoDB server
        await client.connect();
        console.log("Connected successfully to MongoDB");

        const database = client.db('test');
        const collection = database.collection('customers');

        // Insert a test document
        const result = await collection.insertOne({ name: "Test User", email: "test@example.com", pet: "Dog", message: "Test message" });
        console.log("Document inserted:", result.insertedId);

        // Retrieve documents
        const docs = await collection.find().toArray();
        console.log("Found documents:", docs);

    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);
