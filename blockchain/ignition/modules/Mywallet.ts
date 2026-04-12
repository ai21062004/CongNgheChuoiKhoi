import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MywalletModule", (m) => {
  const mywallet = m.contract("Mywallet");

  return { mywallet };
});
