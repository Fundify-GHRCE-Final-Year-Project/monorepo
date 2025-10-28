// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import "../../src/IFundify.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DeployAndCreateFundify is Script {
    function run() external {
        uint256 userPrivateKey = vm.envUint("NEW_USER_PRIVATE_KEY");
        address userPublicKey = vm.addr(userPrivateKey);
        address fundifyAddress = vm.envAddress("FUNDIFY_ADDRESS");

        vm.startBroadcast(userPublicKey);
        IFundify(fundifyAddress).releaseFunds(0, 1 ether, userPublicKey, false);
        vm.stopBroadcast();
    }
}