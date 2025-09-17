// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.22;

import { console } from '@forge-std/Test.sol';
import { Fundify, Project, Investment } from "../src/Fundify.sol";
import { TestSetUp } from "./TestSetUp.sol";

contract BoundaryTests is TestSetUp {
    function testProjectCreationWithInvalidGoal() public {
        vm.startPrank(projectPublisher);
        uint256 _goal = 0;
        uint256 _milestones = 5;
        vm.expectRevert(Fundify.InvalidGoalInput.selector);
        fundify.createProject(_goal, _milestones);
        vm.stopPrank();
    }

    function testProjectCreationWithLowerMilestoneLimit() public {
        vm.startPrank(projectPublisher);
        uint256 _goal = 10;
        uint256 _milestones = 1;
        fundify.createProject(_goal, _milestones);
        vm.stopPrank();
    }

    function testProjectCreationWithHigherMilestoneLimit() public {
        vm.startPrank(projectPublisher);
        uint256 _goal = 10;
        uint256 _milestones = 5;
        fundify.createProject(_goal, _milestones);
        vm.stopPrank();
    }

    function testProjectCreationWithInvalidLowerMilestoneLimit() public {
        vm.startPrank(projectPublisher);
        uint256 _goal = 10;
        uint256 _milestones = 0;
        vm.expectRevert(Fundify.InvalidMilestonesInput.selector);
        fundify.createProject(_goal, _milestones);
        vm.stopPrank();
    }

    function testProjectCreationWithInvalidHigherMilestoneLimit() public {
        vm.startPrank(projectPublisher);
        uint256 _goal = 10;
        uint256 _milestones = 6;
        vm.expectRevert(Fundify.InvalidMilestonesInput.selector);
        fundify.createProject(_goal, _milestones);
        vm.stopPrank();
    }

    function testProjectFundingWithInvalidProjectPublisherAddress() public {
        vm.startPrank(projectPublisher);
        uint256 _goal = 10 ether;
        uint256 _milestones = 5;
        fundify.createProject(_goal, _milestones);
        vm.stopPrank();

        vm.startPrank(user);
        uint256 investment = 3 ether;
        vm.expectRevert(Fundify.InvalidAddressInput.selector);
        fundify.fundProject{value: investment}(address(0), 0);
        vm.stopPrank();
    }

    function testProjectFundingWithInvalidProjectIndex() public {
        vm.startPrank(projectPublisher);
        uint256 _goal = 10 ether;
        uint256 _milestones = 5;
        fundify.createProject(_goal, _milestones);
        vm.stopPrank();

        vm.startPrank(user);
        uint256 investment = 3 ether;
        vm.expectRevert(Fundify.InvalidIndexInput.selector);
        fundify.fundProject{value: investment}(projectPublisher, 1);
        vm.stopPrank();
    }

    function testProjectFundingWithLowerFundLimit() public {
        vm.startPrank(projectPublisher);
        uint256 _goal = 10 ether;
        uint256 _milestones = 5;
        fundify.createProject(_goal, _milestones);
        vm.stopPrank();

        vm.startPrank(user);
        uint256 investment = 0.1 ether;
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();
    }

    function testProjectFundingWithHigherFundLimit() public {
        vm.startPrank(projectPublisher);
        uint256 _goal = 10 ether;
        uint256 _milestones = 5;
        fundify.createProject(_goal, _milestones);
        vm.stopPrank();

        vm.startPrank(user);
        uint256 investment = 10 ether;
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();
    }

    function testProjectFundingWithInvalidLowerFundLimit() public {
        vm.startPrank(projectPublisher);
        uint256 _goal = 10 ether;
        uint256 _milestones = 5;
        fundify.createProject(_goal, _milestones);
        vm.stopPrank();

        vm.startPrank(user);
        uint256 investment = 0 ether;
        vm.expectRevert(Fundify.InvalidFundingAmount.selector);
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();
    }

    function testProjectFundingWithInvalidHigherFundLimit() public {
        vm.startPrank(projectPublisher);
        uint256 _goal = 10 ether;
        uint256 _milestones = 5;
        fundify.createProject(_goal, _milestones);
        vm.stopPrank();

        vm.startPrank(user);
        uint256 investment = 11 ether;
        vm.expectRevert(Fundify.AmountExceedsProjectGoal.selector);
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();
    }

    function testProjectFundReleasingWithAbandonedProject() public {
        vm.startPrank(projectPublisher);
        uint256 _goal = 10 ether;
        uint256 _milestones = 5;
        fundify.createProject(_goal, _milestones);
        vm.stopPrank();

        vm.startPrank(user);
        uint256 investment = 10 ether;
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        fundify.abandonProject(0);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        uint256 fundsToBeReleased = 1 ether;
        vm.expectRevert(Fundify.ProjectAbandoned.selector);
        fundify.releaseFunds(0, fundsToBeReleased, address(treasury), true);
        vm.stopPrank();
    }

    function testProjectFundReleasingWithInvalidProjectIndex() public {
        vm.startPrank(projectPublisher);
        uint256 _goal = 10 ether;
        uint256 _milestones = 5;
        fundify.createProject(_goal, _milestones);
        vm.stopPrank();

        vm.startPrank(user);
        uint256 investment = 10 ether;
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        uint256 fundsToBeReleased = 1 ether;
        vm.expectRevert(Fundify.InvalidIndexInput.selector);
        fundify.releaseFunds(1, fundsToBeReleased, address(treasury), true);
        vm.stopPrank();
    }

    function testProjectFundReleasingWithInvalidAmountInput() public {
        vm.startPrank(projectPublisher);
        uint256 _goal = 10 ether;
        uint256 _milestones = 5;
        fundify.createProject(_goal, _milestones);
        vm.stopPrank();

        vm.startPrank(user);
        uint256 investment = 10 ether;
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        uint256 fundsToBeReleased = 0;
        vm.expectRevert(Fundify.InvalidAmountInput.selector);
        fundify.releaseFunds(0, fundsToBeReleased, address(treasury), true);
        vm.stopPrank();
    }

    function testProjectFundReleasingWithInvalidToAddress() public {
        vm.startPrank(projectPublisher);
        uint256 _goal = 10 ether;
        uint256 _milestones = 5;
        fundify.createProject(_goal, _milestones);
        vm.stopPrank();

        vm.startPrank(user);
        uint256 investment = 10 ether;
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        uint256 fundsToBeReleased = 1 ether;
        vm.expectRevert(Fundify.InvalidAddressInput.selector);
        fundify.releaseFunds(0, fundsToBeReleased, address(0), true);
        vm.stopPrank();
    }

    function testProjectFundReleasingWithNoFunds() public {
        vm.startPrank(projectPublisher);
        uint256 _goal = 10 ether;
        uint256 _milestones = 5;
        fundify.createProject(_goal, _milestones);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        uint256 fundsToBeReleased = 1 ether;
        vm.expectRevert(Fundify.NoFunds.selector);
        fundify.releaseFunds(0, fundsToBeReleased, address(treasury), true);
        vm.stopPrank();
    }

    function testProjectFundReleasingWithInvalidHigherReleaseLimit() public {
        vm.startPrank(projectPublisher);
        uint256 _goal = 10 ether;
        uint256 _milestones = 5;
        fundify.createProject(_goal, _milestones);
        vm.stopPrank();

        vm.startPrank(user);
        uint256 investment = 10 ether;
        fundify.fundProject{value: investment}(projectPublisher, 0);
        vm.stopPrank();

        vm.startPrank(projectPublisher);
        uint256 fundsToBeReleased = 11 ether;
        vm.expectRevert(Fundify.AmountExceedsProjectFund.selector);
        fundify.releaseFunds(0, fundsToBeReleased, address(treasury), true);
        vm.stopPrank();
    }
}