// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.22;

import { console } from '@forge-std/Test.sol';
import { Fundify, Project, Investment } from "../src/Fundify.sol";
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

        uint256 totalInvestors = fundify.investorCount(projectPublisher, 0);
        assertEq(totalInvestors, 1, "Wrong Total Investors");
        console.log("Total Investors: %d", totalInvestors);

        balance = user.balance;
        assertEq(balance, initialBalance - investment, "Wrong initial eth balance");

        vm.stopPrank();
    }

    function testProjectFundReleasing() public {
        vm.warp(block.timestamp + 30 days);
        vm.startPrank(projectPublisher);

        uint256 _goal = 10 ether;
        uint256 _milestones = 4;
        fundify.createProject(_goal, _milestones);

        vm.stopPrank();

        address investor1 = address(23821);
        address investor2 = address(23822);
        address investor3 = address(23823);
        uint256 investment = 1 ether;

        vm.deal(investor1, initialBalance);
        vm.deal(investor2, initialBalance);
        vm.deal(investor3, initialBalance);

        vm.startPrank(investor1);
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();
        vm.startPrank(investor2);
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();
        vm.startPrank(investor3);
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();

        uint256 investorCount = fundify.investorCount(projectPublisher, 0);
        assertEq(investorCount, 3, "Wrong investor count value");

        address personalWallet = address(82739273);
        uint256 releaseAmount = 1 ether;
        vm.startPrank(projectPublisher);
        fundify.releaseFunds(0, releaseAmount, personalWallet, true);
        vm.stopPrank();

        vm.startPrank(investor1);
        fundify.voteOnReleaseRequest(projectPublisher, 0);
        vm.stopPrank();
        vm.startPrank(investor2);
        fundify.voteOnReleaseRequest(projectPublisher, 0);
        vm.stopPrank();
        vm.startPrank(investor3);
        fundify.voteOnReleaseRequest(projectPublisher, 0);
        vm.stopPrank();

        vm.warp(block.timestamp + 7.1 days);

        uint256 balance = personalWallet.balance;
        assertEq(balance, 0, "Wrong initial personalWallet eth balance");

        vm.startPrank(projectPublisher);
        fundify.releaseFunds(0, releaseAmount, personalWallet, false);
        vm.stopPrank();

        balance = personalWallet.balance;
        assertEq(balance, releaseAmount, "Wrong final personalWallet eth balance");
    }

    function testFundReleaseInitiationWhenMilestoneNotReached() public {
        vm.warp(block.timestamp + 30 days);
        vm.startPrank(projectPublisher);

        uint256 _goal = 10 ether;
        uint256 _milestones = 4;
        fundify.createProject(_goal, _milestones);

        vm.stopPrank();

        address investor = address(23821);
        uint256 investment = 1 ether;

        vm.deal(investor, initialBalance);

        vm.startPrank(investor);
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();

        address personalWallet = address(82739273);
        uint256 releaseAmount = 1 ether;
        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.MilestoneNotReached.selector);
        fundify.releaseFunds(0, releaseAmount, personalWallet, true);
        vm.stopPrank();
    }

    function testFundReleaseInitiationWhileVotingCycle() public {
        vm.warp(block.timestamp + 30 days);
        vm.startPrank(projectPublisher);

        uint256 _goal = 10 ether;
        uint256 _milestones = 4;
        fundify.createProject(_goal, _milestones);

        vm.stopPrank();

        address investor = address(23821);
        uint256 investment = 5 ether;

        vm.deal(investor, initialBalance);

        vm.startPrank(investor);
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();

        address personalWallet = address(82739273);
        uint256 releaseAmount = 1 ether;
        vm.startPrank(projectPublisher);
        fundify.releaseFunds(0, releaseAmount, personalWallet, true);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.VotingCycleGoingOn.selector);
        fundify.releaseFunds(0, releaseAmount, personalWallet, true);
        vm.stopPrank();
    }

    function testFundReleaseInitiationOnCooldown() public {
        vm.warp(block.timestamp + 30 days);
        vm.startPrank(projectPublisher);

        uint256 _goal = 10 ether;
        uint256 _milestones = 4;
        fundify.createProject(_goal, _milestones);

        vm.stopPrank();

        address investor = address(23821);
        uint256 investment = 5 ether;

        vm.deal(investor, initialBalance);

        vm.startPrank(investor);
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();

        address personalWallet = address(82739273);
        uint256 releaseAmount = 1 ether;
        vm.startPrank(projectPublisher);
        fundify.releaseFunds(0, releaseAmount, personalWallet, true);
        vm.stopPrank();

        vm.startPrank(investor);
        fundify.voteOnReleaseRequest(projectPublisher, 0);
        vm.stopPrank();

        vm.warp(block.timestamp + 7.1 days);

        vm.startPrank(projectPublisher);
        fundify.releaseFunds(0, releaseAmount, personalWallet, false);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.OnCooldown.selector);
        fundify.releaseFunds(0, releaseAmount, personalWallet, true);
        vm.stopPrank();
    }

    function testProjectFundReleasingWhileVotingCycle() public {
        vm.warp(block.timestamp + 30 days);
        vm.startPrank(projectPublisher);

        uint256 _goal = 10 ether;
        uint256 _milestones = 4;
        fundify.createProject(_goal, _milestones);

        vm.stopPrank();

        address investor = address(23821);
        uint256 investment = 5 ether;

        vm.deal(investor, initialBalance);

        vm.startPrank(investor);
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();

        address personalWallet = address(82739273);
        uint256 releaseAmount = 1 ether;
        vm.startPrank(projectPublisher);
        fundify.releaseFunds(0, releaseAmount, personalWallet, true);
        vm.stopPrank();

        vm.startPrank(investor);
        fundify.voteOnReleaseRequest(projectPublisher, 0);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.VotingCycleNotEnded.selector);
        fundify.releaseFunds(0, releaseAmount, personalWallet, false);
        vm.stopPrank();
    }

    function testProjectFundReleasingWithoutEnoughVotes() public {
        vm.warp(block.timestamp + 30 days);
        vm.startPrank(projectPublisher);

        uint256 _goal = 10 ether;
        uint256 _milestones = 4;
        fundify.createProject(_goal, _milestones);

        vm.stopPrank();

        address investor1 = address(23821);
        address investor2 = address(23822);
        address investor3 = address(23823);
        address investor4 = address(23824);
        uint256 investment = 1 ether;

        vm.deal(investor1, initialBalance);
        vm.deal(investor2, initialBalance);
        vm.deal(investor3, initialBalance);
        vm.deal(investor4, initialBalance);

        vm.startPrank(investor1);
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();
        vm.startPrank(investor2);
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();
        vm.startPrank(investor3);
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();
        vm.startPrank(investor4);
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();

        address personalWallet = address(82739273);
        uint256 releaseAmount = 1 ether;
        vm.startPrank(projectPublisher);
        fundify.releaseFunds(0, releaseAmount, personalWallet, true);
        vm.stopPrank();

        vm.startPrank(investor1);
        fundify.voteOnReleaseRequest(projectPublisher, 0);
        vm.stopPrank();

        vm.warp(block.timestamp + 7.1 days);

        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.NotEnoughVotes.selector);
        fundify.releaseFunds(0, releaseAmount, personalWallet, false);
        vm.stopPrank();
    }
}