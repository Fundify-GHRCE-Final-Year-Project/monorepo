// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.22;

import { Fundify } from "../src/Fundify.sol";
import { TestSetUp } from "./TestSetUp.sol";

contract FundingTests is TestSetUp {
    function testProjectFunding() public {
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 5);
        vm.stopPrank();

        vm.startPrank(user);
        uint256 balance = user.balance;
        assertEq(balance, initialBalance, "Wrong initial eth balance");

        uint256 investment = 3 ether;
        fundify.fundProject{value: investment}(projectPublisher, 0);

        (,,,,uint256 funded,) = fundify.projects(projectPublisher, 0);
        assertEq(funded, investment, "Wrong project fund value");

        uint256 investmentCount = fundify.investmentCount(user);
        assertEq(investmentCount, 1, "Wrong investment count value");

        (
            address projectOwner, 
            uint256 projectIndex, 
            uint256 amount
        ) = fundify.investments(user, 0);
        assertEq(projectOwner, projectPublisher, "Wrong invested project owner");    
        assertEq(projectIndex, 0, "Wrong invested project index");
        assertEq(amount, investment, "Wrong invested amount");

        uint256 totalInvestors = fundify.investorCount(projectPublisher, 0);
        assertEq(totalInvestors, 1, "Wrong Total Investors");

        balance = user.balance;
        assertEq(balance, initialBalance - investment, "Wrong final eth balance");

        vm.stopPrank();
    }

    function testProjectFundingWithInvalidProjectPublisherAddress() public {
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 5);
        vm.stopPrank();

        vm.startPrank(user);
        vm.expectRevert(Fundify.InvalidAddressInput.selector);
        fundify.fundProject{value: 3 ether}(address(0), 0);
        vm.stopPrank();
    }

    function testProjectFundingWithInvalidProjectIndex() public {
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 5);
        vm.stopPrank();

        vm.startPrank(user);
        vm.expectRevert(Fundify.InvalidIndexInput.selector);
        fundify.fundProject{value: 3 ether}(projectPublisher, 1);
        vm.stopPrank();
    }

    function testProjectFundingWithLowerFundLimit() public {
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 5);
        vm.stopPrank();

        vm.startPrank(user);
        fundify.fundProject{value: 0.1 ether}(projectPublisher, 0);
        vm.stopPrank();
    }

    function testProjectFundingWithHigherFundLimit() public {
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 5);
        vm.stopPrank();

        vm.startPrank(user);
        fundify.fundProject{value: 10 ether}(projectPublisher, 0);
        vm.stopPrank();
    }

    function testProjectFundingWithInvalidLowerFundLimit() public {
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 5);
        vm.stopPrank();

        vm.startPrank(user);
        vm.expectRevert(Fundify.InvalidFundingAmount.selector);
        fundify.fundProject{value: 0 ether}(projectPublisher, 0);
        vm.stopPrank();
    }

    function testProjectFundingWithInvalidHigherFundLimit() public {
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 5);
        vm.stopPrank();

        vm.startPrank(user);
        vm.expectRevert(Fundify.AmountExceedsProjectGoal.selector);
        fundify.fundProject{value: 11 ether}(projectPublisher, 0);
        vm.stopPrank();
    }
}
