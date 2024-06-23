import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers"; // Asegurándose de que Contract está importado.

/**
 * Deploys a contract named "Vendor" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployVendor: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  // En localhost, la cuenta del deployer es la que viene con Hardhat, la cual ya está financiada.
  // Cuando se despliegue en redes en vivo (por ejemplo, `yarn deploy --network goerli`), la cuenta del deployer
  // debe tener saldo suficiente para pagar las tarifas de gas para la creación del contrato.
  // Puedes generar una cuenta aleatoria con `yarn generate` que llenará DEPLOYER_PRIVATE_KEY
  // con una clave privada aleatoria en el archivo .env (luego usada en hardhat.config.ts)
  // Puedes usar el comando `yarn account` para verificar tu saldo en cada red.

  // Desplegar Vendor
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const yourToken = await hre.ethers.getContract<Contract>("YourToken", deployer);
  const yourTokenAddress = await yourToken.getAddress();
  await deploy("Vendor", {
    from: deployer,
    args: [yourTokenAddress],
    log: true,
    autoMine: true, // Se puede pasar a la función de despliegue para hacer el proceso de despliegue más rápido en redes locales automáticamente minando la transacción de despliegue del contrato. No tiene efecto en redes en vivo.
  });
  const vendor = await hre.ethers.getContract<Contract>("Vendor", deployer);
  const vendorAddress = await vendor.getAddress();

  // Transferir tokens al Vendor
  await yourToken.transfer(vendorAddress, hre.ethers.parseEther("1000"));

  // Transferir la propiedad del contrato al dirección de tu frontend
  await vendor.transferOwnership("0x9f17300E6Ba198D1d1071F89AC59c5536b7D8ABE"); // Reemplaza "**YOUR FRONTEND ADDRESS**" con la dirección real de tu frontend.
};

export default deployVendor;

// Las etiquetas son útiles si tienes múltiples archivos de despliegue y solo quieres ejecutar uno de ellos.
// por ejemplo, `yarn deploy --tags Vendor`
deployVendor.tags = ["Vendor"];
