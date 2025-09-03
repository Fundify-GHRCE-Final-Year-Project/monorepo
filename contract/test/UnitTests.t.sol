// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.22;

import { console } from '@forge-std/Test.sol';
import { Project, Investment } from "../src/Fundify.sol";
import { TestSetUp } from "./TestSetUp.sol";

contract UnitTests is TestSetUp {
    function testProjectCreation() public {
        vm.startPrank(projectPublisher);

        uint256 _goal = 1 ether;
        uint256 _milestones = 1;
        fundify.createProject(_goal, _milestones);

        uint256 projectCount = fundify.projectCount(projectPublisher);
        assertEq(projectCount, 1, "1: Wrong project count");

        (
            address owner, 
            uint256 index, 
            uint256 goal,
            uint256 milestones,
            uint256 funded,
            uint256 released
        ) = fundify.projects(projectPublisher, 0);

        assertEq(owner, projectPublisher, "1: Wrong project owner");
        assertEq(index, 0, "1: Wrong project index");
        assertEq(goal, _goal, "1: Wrong project goal");
        assertEq(milestones, _milestones, "1: Wrong project milestones");
        assertEq(funded, 0, "1: Wrong project fund value");
        assertEq(released, 0, "1: Wrong project fund released value");

        vm.stopPrank();
    }

    function testProjectCreationInvalidInputs() public {
        vm.startPrank(user);

        vm.stopPrank();
    }

    function testProjectFunding() public {
        vm.startPrank(projectPublisher);

        uint256 _goal = 10 ether;
        uint256 _milestones = 5;
        fundify.createProject(_goal, _milestones);

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

        balance = user.balance;
        assertEq(balance, initialBalance - investment, "Wrong initial eth balance");

        vm.stopPrank();
    }

    function testProjectFundingInvalidInputs() public {
        vm.startPrank(user);
        
        vm.stopPrank();
    }

    function testProjectFundReleasing() public {
        vm.startPrank(projectPublisher);

        uint256 _goal = 10 ether;
        uint256 _milestones = 5;
        fundify.createProject(_goal, _milestones);

        vm.stopPrank();

        vm.startPrank(user);

        uint256 investment = 3 ether;
        fundify.fundProject{value: investment}(projectPublisher, 0);

        vm.stopPrank();

        vm.startPrank(projectPublisher);

        uint256 balance = treasury.balance;
        assertEq(balance, 0, "1: Wrong Treasury Balance");

        uint256 fundsToBeReleased = 1 ether;
        fundify.releaseFunds(0, fundsToBeReleased, treasury);

        balance = treasury.balance;
        assertEq(balance, fundsToBeReleased, "2: Wrong Treasury Balance");

        vm.stopPrank();
    }

    function testProjectFundReleasingInvalidInputs() public {
        vm.startPrank(user);
        
        vm.stopPrank();
    }
}