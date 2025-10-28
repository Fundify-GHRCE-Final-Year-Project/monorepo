// SPDX-License-Identifier: LicenseRef-MIT-NC
pragma solidity ^0.8.22;

struct Project {
    address owner; // Wallet address of the project's publisher
    uint256 index; // Index to query off chain database using owner and index, starts from 0 and onwards
    uint256 goal; // Total ETH needed for the project
    uint256 milestones; // Number of milestones, if 2 then it's 50% and 100%
    // if 3 then 33, 66, 99, basically divide the goal by milestones, max 20
    uint256 funded; // Amount of ETH funded
    uint256 released; // Amount of ETH released
}

struct Investment {
    address projectOwner; // Wallet address of the project's publisher
    uint256 projectIndex; // Nth project of the project owner that user funded
    uint256 amount; // Amount of ETH funded
}

interface IFundify {
    // Events
    event ProjectCreated(
        address owner,
        uint256 index,
        uint256 goal,
        uint256 milestones,
        uint256 timestamp
    );
    
    event ProjectFunded(
        address funder,
        uint256 investmentIndex,
        uint256 amount,
        address projectOwner,
        uint256 projectIndex,
        uint256 timestamp
    );
    
    event ProjectFundsReleased(
        address owner,
        uint256 index,
        uint256 amount,
        address to,
        uint256 cycle,
        uint256 timestamp
    );
    
    event VotingCycleInitiated(
        address projectOwner,
        uint256 projectIndex,
        uint256 amount,
        address depositWallet,
        uint256 votingCycle,
        uint256 votingDeadline,
        uint256 votesNeeded
    );
    
    event Voted(
        address projectOwner,
        uint256 projectIndex,
        address voteBy,
        uint256 votingCycle
    );

    // View functions
    function projects(address owner, uint256 index) external view returns (Project memory);
    function projectCount(address owner) external view returns (uint256);
    function investments(address investor, uint256 index) external view returns (Investment memory);
    function investmentCount(address investor) external view returns (uint256);
    function investorCount(address projectOwner, uint256 projectIndex) external view returns (uint256);
    function votingCycle(address projectOwner, uint256 projectIndex) external view returns (uint256);
    function votingDeadline(address projectOwner, uint256 projectIndex, uint256 cycle) external view returns (uint256);
    function votes(address projectOwner, uint256 projectIndex, uint256 cycle) external view returns (uint256);
    function voted(address projectOwner, uint256 projectIndex, uint256 cycle, address voter) external view returns (bool);
    function VOTING_DEADLINE() external view returns (uint256);
    function VOTING_COOLDOWN() external view returns (uint256);
    function REQUIRED_VOTES() external view returns (uint256);

    // State-changing functions
    function initialize() external;
    function createProject(uint256 _goal, uint256 _milestones) external;
    function fundProject(address _projectOwner, uint256 _projectIndex) external payable;
    function voteOnReleaseRequest(address _projectOwner, uint256 _projectIndex) external;
    function releaseFunds(uint256 _projectIndex, uint256 _amount, address _to, bool initiate) external payable;
    function abandonProject(uint256 _projectIndex) external;
    function withdrawFunds(address _projectOwner, uint256 _projectIndex) external payable;
}