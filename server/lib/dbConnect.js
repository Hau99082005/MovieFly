const mongoose = require("mongoose");
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const dbConnect = () => {
  const URI = process.env.MONGODB_URI;
  
  console.log("🔄 Attempting to connect to MongoDB...");
  console.log("📍 Using DNS servers: 1.1.1.1, 8.8.8.8");
  
  mongoose
    .connect(URI)
    .then(() => {
      console.log("✅ Database is connected");
      console.log(`📁 Database: ${mongoose.connection.name}`);
      console.log(`🌐 Host: ${mongoose.connection.host}`);
    })
    .catch((error) => {
      console.error("❌ Database connection failed:", error.message);
      console.error("\n💡 Giải pháp:");
      console.error("   1. Kiểm tra connection string trong .env");
      console.error("   2. Kiểm tra Network Access trong MongoDB Atlas");
      console.error("   3. Tắt firewall/VPN để test");
      process.exit(1);
    });
};

module.exports = dbConnect;
