// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.22;

import { Test } from '@forge-std/Test.sol';
import { Fundify } from "../src/Fundify.sol";
import { ERC1967Proxy } from "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";


contract TestSetUp is Test {
    Fundify public fundify;
    address public owner = address(1906);
    address public projectPublisher = address(1907);
    address public user = address(1908);
    address public treasury = address(1909);
    uint256 initialBalance = 1e6 * 1 ether;

    function setUp() public {
        vm.deal(user, initialBalance);
        vm.startPrank(owner);

        // Deploying the Fundify contract
        fundify = new Fundify();
        bytes memory data = abi.encodeWithSelector(Fundify.initialize.selector);
        ERC1967Proxy proxy = new ERC1967Proxy(address(fundify), data);
        fundify = Fundify(address(proxy));

        vm.stopPrank();
    }
}