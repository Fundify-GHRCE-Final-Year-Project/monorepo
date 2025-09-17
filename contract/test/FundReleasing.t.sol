// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.22;

import { Fundify } from "../src/Fundify.sol";
import { TestSetUp } from "./TestSetUp.sol";

contract FundReleasingTests is TestSetUp {
    function testProjectFundReleasing() public {
        vm.warp(block.timestamp + 30 days);
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 4);
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

        vm.startPrank(projectPublisher);
        fundify.releaseFunds(0, releaseAmount, personalWallet, false);
        vm.stopPrank();

        assertEq(personalWallet.balance, releaseAmount, "Wrong final personalWallet eth balance");
    }

    function testProjectFundReleasingWithAbandonedProject() public {
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 5);
        vm.stopPrank();

        vm.startPrank(user);
        fundify.fundProject{value: 10 ether}(projectPublisher, 0);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        fundify.abandonProject(0);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.ProjectAbandoned.selector);
        fundify.releaseFunds(0, 1 ether, address(treasury), true);
        vm.stopPrank();
    }

    function testProjectFundReleasingWithInvalidProjectIndex() public {
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 5);
        vm.stopPrank();

        vm.startPrank(user);
        fundify.fundProject{value: 10 ether}(projectPublisher, 0);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.InvalidIndexInput.selector);
        fundify.releaseFunds(1, 1 ether, address(treasury), true);
        vm.stopPrank();
    }

    function testProjectFundReleasingWithInvalidAmountInput() public {
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 5);
        vm.stopPrank();

        vm.startPrank(user);
        fundify.fundProject{value: 10 ether}(projectPublisher, 0);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.InvalidAmountInput.selector);
        fundify.releaseFunds(0, 0, address(treasury), true);
        vm.stopPrank();
    }

    function testProjectFundReleasingWithInvalidToAddress() public {
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 5);
        vm.stopPrank();

        vm.startPrank(user);
        fundify.fundProject{value: 10 ether}(projectPublisher, 0);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.InvalidAddressInput.selector);
        fundify.releaseFunds(0, 1 ether, address(0), true);
        vm.stopPrank();
    }

    function testProjectFundReleasingWithNoFunds() public {
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 5);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.NoFunds.selector);
        fundify.releaseFunds(0, 1 ether, address(treasury), true);
        vm.stopPrank();
    }

    function testProjectFundReleasingWithInvalidHigherReleaseLimit() public {
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 5);
        vm.stopPrank();

        vm.startPrank(user);
        fundify.fundProject{value: 10 ether}(projectPublisher, 0);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.AmountExceedsProjectFund.selector);
        fundify.releaseFunds(0, 11 ether, address(treasury), true);
        vm.stopPrank();
    }

    function testFundReleaseInitiationWhenMilestoneNotReached() public {
        vm.warp(block.timestamp + 30 days);
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 4);
        vm.stopPrank();

        address investor = address(23821);
        vm.deal(investor, initialBalance);

        vm.startPrank(investor);
        fundify.fundProject{value: 1 ether}(projectPublisher, 0);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.MilestoneNotReached.selector);
        fundify.releaseFunds(0, 1 ether, address(82739273), true);
        vm.stopPrank();
    }

    function testFundReleaseInitiationWhileVotingCycle() public {
        vm.warp(block.timestamp + 30 days);
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 4);
        vm.stopPrank();

        address investor = address(23821);
        vm.deal(investor, initialBalance);

        vm.startPrank(investor);
        fundify.fundProject{value: 5 ether}(projectPublisher, 0);
        vm.stopPrank();

        address personalWallet = address(82739273);

        vm.startPrank(projectPublisher);
        fundify.releaseFunds(0, 1 ether, personalWallet, true);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.VotingCycleGoingOn.selector);
        fundify.releaseFunds(0, 1 ether, personalWallet, true);
        vm.stopPrank();
    }

    function testFundReleaseInitiationOnCooldown() public {
        vm.warp(block.timestamp + 30 days);
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 4);
        vm.stopPrank();

        address investor = address(23821);
        vm.deal(investor, initialBalance);

        vm.startPrank(investor);
        fundify.fundProject{value: 5 ether}(projectPublisher, 0);
        vm.stopPrank();

        address personalWallet = address(82739273);

        vm.startPrank(projectPublisher);
        fundify.releaseFunds(0, 1 ether, personalWallet, true);
        vm.stopPrank();

        vm.startPrank(investor);
        fundify.voteOnReleaseRequest(projectPublisher, 0);
        vm.stopPrank();

        vm.warp(block.timestamp + 7.1 days);

        vm.startPrank(projectPublisher);
        fundify.releaseFunds(0, 1 ether, personalWallet, false);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.OnCooldown.selector);
        fundify.releaseFunds(0, 1 ether, personalWallet, true);
        vm.stopPrank();
    }

    function testProjectFundReleasingWhileVotingCycle() public {
        vm.warp(block.timestamp + 30 days);
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 4);
        vm.stopPrank();

        address investor = address(23821);
        vm.deal(investor, initialBalance);

        vm.startPrank(investor);
        fundify.fundProject{value: 5 ether}(projectPublisher, 0);
        vm.stopPrank();

        address personalWallet = address(82739273);

        vm.startPrank(projectPublisher);
        fundify.releaseFunds(0, 1 ether, personalWallet, true);
        vm.stopPrank();

        vm.startPrank(investor);
        fundify.voteOnReleaseRequest(projectPublisher, 0);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.VotingCycleNotEnded.selector);
        fundify.releaseFunds(0, 1 ether, personalWallet, false);
        vm.stopPrank();
    }

    function testProjectFundReleasingWithoutEnoughVotes() public {
        vm.warp(block.timestamp + 30 days);
        vm.startPrank(projectPublisher);
        fundify.createProject(10 ether, 4);
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

        vm.startPrank(projectPublisher);
        fundify.releaseFunds(0, 1 ether, personalWallet, true);
        vm.stopPrank();

        vm.startPrank(investor1);
        fundify.voteOnReleaseRequest(projectPublisher, 0);
        vm.stopPrank();

        vm.warp(block.timestamp + 7.1 days);

        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.NotEnoughVotes.selector);
        fundify.releaseFunds(0, 1 ether, personalWallet, false);
        vm.stopPrank();
    }
}
