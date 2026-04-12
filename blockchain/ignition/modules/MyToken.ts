import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MyTokenModule", (m) => {
    const mytoken = m.contract("MyToken");

    return { mytoken };
});
