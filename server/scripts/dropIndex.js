require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const fixIndexes = async () => {
  try {
    console.log("🔄 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Connected");

    const db = mongoose.connection.db;
    const collection = db.collection("users");

    console.log("\n📋 Current indexes:");
    const indexes = await collection.indexes();
    console.log(JSON.stringify(indexes, null, 2));

    console.log("\n🗑️ Dropping clerkId_1 index...");
    try {
      await collection.dropIndex("clerkId_1");
      console.log("✅ Dropped clerkId_1");
    } catch (error) {
      if (error.codeName === "IndexNotFound") {
        console.log("⚠️ Index clerkId_1 not found (already dropped)");
      } else {
        throw error;
      }
    }

    console.log("\n✨ Creating new sparse unique index on clerkId...");
    await collection.createIndex(
      { clerkId: 1 },
      { unique: true, sparse: true, name: "clerkId_1_sparse" }
    );
    console.log("✅ Created sparse index");

    console.log("\n📋 New indexes:");
    const newIndexes = await collection.indexes();
    console.log(JSON.stringify(newIndexes, null, 2));

    await mongoose.connection.close();
    console.log("\n✅ Done! Restart your server now.");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

fixIndexes();
