const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });

async function main() {
  const metadataURL = "QmQBHarz2WFczTjz5GnhjHrbUPDnB48W5BM2v2h6HbE1rZ";

  const lw3PunksContract = await ethers.deployContract("LW3Punks", [
    metadataURL
  ]);

  await lw3PunksContract.waitForDeployment();

  console.log("LW3Punks Contract Address:", lw3PunksContract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });