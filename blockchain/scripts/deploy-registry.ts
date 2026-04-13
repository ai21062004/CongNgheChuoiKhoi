import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect({
    network: "cronos",
    chainType: "l1",
  });
  console.log("🚀 Deploying UserRegistry to Cronos testnet...");

  const [deployer] = await ethers.getSigners();
  console.log("📋 Deployer address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Deployer balance:", ethers.formatEther(balance), "tCRO");

  // Deploy UserRegistry
  const UserRegistry = await ethers.getContractFactory("UserRegistry");
  const registry = await UserRegistry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("✅ UserRegistry deployed to:", address);
  console.log("👤 Owner:", await registry.owner());
  console.log("");
  console.log("📝 Lưu địa chỉ contract này vào file .env của backend:");
  console.log(`   USER_REGISTRY_ADDRESS=${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deploy failed:", error);
    process.exit(1);
  });
