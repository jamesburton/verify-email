import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import dotenv from "dotenv";
import { HardhatConfig } from "hardhat/types";

dotenv.config();

const infuraKey = process.env.INFURA_KEY;
const privateKey = process.env.PRIVATE_KEY;
const fantomPrivateKey = process.env.FANTOM_PRIVATE_KEY;
const infuraNetworks = ['goerli'];
type networkType = {
    url: string;
    accounts?: string[];
    chainId?: number;
    live?: boolean;
    saveDeployments?: boolean;
    gasMultiplier?: number;
};
type networksType = {
    [key:string]: networkType;
    // goerli?: networkType;
    // fantom?: networkType;
    // ["fantom-test"]?: networkType;
};
const networks:networksType = {};
let accounts:string[] = [process.env.PRIVATE_KEY].filter(key => key?.length) as string[];
if(infuraKey?.length) {
    for(const network of infuraNetworks) {
        networks[network] = {
            url: `https://${network}.infura.io/v3/${infuraKey}`,
	    accounts,
        }
    }
}
if(fantomPrivateKey) {
    const fantomAccounts = [fantomPrivateKey];
    networks.fantom = {
        url: "https://rpc.fantom.network",
        accounts: fantomAccounts,
        chainId: 250,
        live: true,
        saveDeployments: true,
        gasMultiplier: 1,
    };
    networks['fantom-test'] = {
        url: "https://rpc.testnet.fantom.network",
        accounts: fantomAccounts,
        chainId: 4002,
        live: false,
        saveDeployments: true,
        gasMultiplier: 2,
    };
}

type ExtendedHardhatUserConfig = HardhatUserConfig & {
    etherscan: { apiKey?: string },
};
const config: ExtendedHardhatUserConfig = {
  solidity: "0.8.17",
  networks,
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY
  },
};

export default config;
