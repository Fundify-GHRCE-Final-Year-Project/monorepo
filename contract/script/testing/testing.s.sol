// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Script.sol";
import "../../src/Fundify.sol";
import {ERC1967Proxy} from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract DeployAndCreateFundify is Script {
    function run() external {
        uint256 userPrivateKey = vm.envUint("NEW_USER_PRIVATE_KEY");
        address userPublicKey = vm.addr(userPrivateKey);
        
        uint256 funder1PrivateKey = vm.envUint("USER1_PRIVATE_KEY");
        uint256 funder2PrivateKey = vm.envUint("USER2_PRIVATE_KEY");
        uint256 funder3PrivateKey = vm.envUint("USER3_PRIVATE_KEY");
        uint256 funder4PrivateKey = vm.envUint("USER4_PRIVATE_KEY");
        uint256 funder5PrivateKey = vm.envUint("USER5_PRIVATE_KEY");

        vm.startBroadcast(userPrivateKey);

        Fundify fundify = new Fundify();
        bytes memory data = abi.encodeWithSelector(
            Fundify.initialize.selector
        );
        ERC1967Proxy proxy = new ERC1967Proxy(address(fundify), data);
        fundify = Fundify(address(proxy));
        console.log("Fundify deployed at:", address(proxy));

        fundify.createProject(10 ether, 2);
        fundify.createProject(5 ether, 3);
        fundify.createProject(20 ether, 4);

        vm.stopBroadcast();

        vm.startBroadcast(funder1PrivateKey);

        fundify.fundProject{value: 2 ether}(userPublicKey, 0);
        fundify.fundProject{value: 1 ether}(userPublicKey, 1);
        fundify.fundProject{value: 2 ether}(userPublicKey, 2);

        vm.stopBroadcast();

        vm.startBroadcast(funder2PrivateKey);

        fundify.fundProject{value: 2 ether}(userPublicKey, 0);
        fundify.fundProject{value: 1 ether}(userPublicKey, 1);
        fundify.fundProject{value: 2 ether}(userPublicKey, 2);

        vm.stopBroadcast();

        vm.startBroadcast(funder3PrivateKey);

        fundify.fundProject{value: 2 ether}(userPublicKey, 0);
        fundify.fundProject{value: 1 ether}(userPublicKey, 1);
        fundify.fundProject{value: 2 ether}(userPublicKey, 2);

        vm.stopBroadcast();

        vm.startBroadcast(userPublicKey);
        fundify.releaseFunds(0, 1 ether, userPublicKey, true);
        vm.stopBroadcast();

        vm.startBroadcast(funder1PrivateKey);
        fundify.voteOnReleaseRequest(userPublicKey, 0);
        vm.stopBroadcast();

        vm.startBroadcast(funder2PrivateKey);
        fundify.voteOnReleaseRequest(userPublicKey, 0);
        vm.stopBroadcast();
    }
}