// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.22;

import { Fundify } from "../src/Fundify.sol";
import { TestSetUp } from "./TestSetUp.sol";

contract ProjectCreationTests is TestSetUp {
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

    function testProjectCreationWithInvalidGoal() public {
        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.InvalidGoalInput.selector);
        fundify.createProject(0, 5);
        vm.stopPrank();
    }

    function testProjectCreationWithLowerMilestoneLimit() public {
        vm.startPrank(projectPublisher);
        fundify.createProject(10, 1);
        vm.stopPrank();
    }

    function testProjectCreationWithHigherMilestoneLimit() public {
        vm.startPrank(projectPublisher);
        fundify.createProject(10, 5);
        vm.stopPrank();
    }

    function testProjectCreationWithInvalidLowerMilestoneLimit() public {
        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.InvalidMilestonesInput.selector);
        fundify.createProject(10, 0);
        vm.stopPrank();
    }

    function testProjectCreationWithInvalidHigherMilestoneLimit() public {
        vm.startPrank(projectPublisher);
        vm.expectRevert(Fundify.InvalidMilestonesInput.selector);
        fundify.createProject(10, 6);
        vm.stopPrank();
    }
}
