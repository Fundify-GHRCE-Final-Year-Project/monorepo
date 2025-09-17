// SPDX-License-Identifier: LicenseRef-MIT-NC
pragma solidity ^0.8.22;

import "@openzeppelin-upgradeable/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin-upgradeable/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin-upgradeable/contracts/access/OwnableUpgradeable.sol";

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

contract Fundify is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    mapping(address => mapping(uint256 => Project)) public projects;
    mapping(address => uint256) public projectCount;
    mapping(address => mapping(uint256 => bool)) projectAbandoned;

    mapping(address => mapping(uint256 => Investment)) public investments;
    mapping(address => uint256) public investmentCount;
    mapping(address => mapping(uint256 => uint256)) public investorCount;
    mapping(address => mapping(uint256 => mapping(address => uint256))) investmentWithdrawn;

    mapping(address => mapping(uint256 => uint256)) public votingCycle;
    mapping(address => mapping(uint256 => mapping(uint256 => uint256))) public votingDeadline;
    mapping(address => mapping(uint256 => mapping(uint256 => uint256))) public votes;
    mapping(address => mapping(uint256 => mapping(uint256 => mapping(address => bool)))) public voted;

    uint256 public VOTING_DEADLINE = 7 days;
    uint256 public VOTING_COOLDOWN = 7 days;
    uint256 public REQUIRED_VOTES = 60;

    error InvalidGoalInput();
    error InvalidMilestonesInput();
    error InvalidAddressInput();
    error InvalidIndexInput();
    error InvalidAmountInput();
    error InvalidFundingAmount();

    error AmountExceedsProjectGoal();
    error AmountExceedsProjectFund();
    error ProjectEnded();
    error NoFunds();
    error ProjectEmpty();

    error EthereumTransferFailed();

    error OnCooldown();
    error NotEnoughVotes();
    error VotingCycleNotEnded();
    error VotingCycleGoingOn();
    error VotingCycleEnded();
    error AlreadyVoted();
    error MilestoneNotReached();
    error ProjectAbandoned();
    error ProjectNotAbandoned();

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
        uint256 timestamp
    );

    function _authorizeUpgrade(address newImpl) internal override onlyOwner {}

    function initialize() public initializer {
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        VOTING_DEADLINE = 7 days;
        VOTING_COOLDOWN = 7 days;
        REQUIRED_VOTES = 60;
    }

    function createProject(uint256 _goal, uint256 _milestones) public {
        if (_goal == 0) revert InvalidGoalInput();
        if (_milestones == 0 || _milestones > 5) revert InvalidMilestonesInput();

        uint256 projectIndex = projectCount[msg.sender]++;

        Project storage project = projects[msg.sender][projectIndex];
        project.owner = msg.sender;
        project.index = projectIndex;
        project.goal = _goal;
        project.milestones = _milestones;
        project.funded = 0;
        project.released = 0;

        emit ProjectCreated(
            msg.sender,
            projectIndex,
            _goal,
            _milestones,
            block.timestamp
        );
    }

    function fundProject(
        address _projectOwner,
        uint256 _projectIndex
    ) external payable {
        if (_projectOwner == address(0)) revert InvalidAddressInput();
        if (projectCount[_projectOwner] < _projectIndex + 1) revert InvalidIndexInput();
        if (projectAbandoned[_projectOwner][_projectIndex]) revert ProjectAbandoned();
        if (msg.value == 0) revert InvalidFundingAmount();

        Project storage project = projects[_projectOwner][_projectIndex];
        if (project.goal - project.funded == 0) revert ProjectEnded();
        uint256 amountAfterFunding = project.funded + msg.value;
        if (amountAfterFunding > project.goal) revert AmountExceedsProjectGoal();

        uint256 investmentIndex = investmentCount[msg.sender]++;
        Investment storage investment = investments[msg.sender][investmentIndex];
        investment.projectOwner = _projectOwner;
        investment.projectIndex = _projectIndex;
        investment.amount += msg.value;
        project.funded = amountAfterFunding;

        investorCount[_projectOwner][_projectIndex] += 1;
        
        emit ProjectFunded(
            msg.sender,
            investmentIndex,
            msg.value,
            _projectOwner,
            _projectIndex,
            block.timestamp
        );
    }

    function voteOnReleaseRequest(
        address _projectOwner,
        uint256 _projectIndex
    ) external {
        if (projectAbandoned[_projectOwner][_projectIndex]) revert ProjectAbandoned();
        uint256 cycle = votingCycle[_projectOwner][_projectIndex];
        uint256 deadline = votingDeadline[_projectOwner][_projectIndex][cycle];
        if (block.timestamp > deadline) revert VotingCycleEnded();
        bool hasVoted = voted[_projectOwner][_projectIndex][cycle][msg.sender];
        if (hasVoted) revert AlreadyVoted();
        else {
            voted[_projectOwner][_projectIndex][cycle][msg.sender] = true;
            votes[_projectOwner][_projectIndex][cycle] += 1;
        }
    }

    function releaseFunds(
        uint256 _projectIndex,
        uint256 _amount,
        address _to,
        bool initiate
    ) external payable {
        if (projectAbandoned[msg.sender][_projectIndex]) revert ProjectAbandoned();
        if (projectCount[msg.sender] < _projectIndex + 1) revert InvalidIndexInput();
        if (_amount == 0) revert InvalidAmountInput();
        if (_to == address(0)) revert InvalidAddressInput();
        Project storage project = projects[msg.sender][_projectIndex];
        uint256 remainingAmount = project.funded - project.released;
        if (remainingAmount == 0) revert NoFunds();
        if (remainingAmount < _amount) revert AmountExceedsProjectFund();

        if (initiate) {
            uint256 milestoneAmount = project.goal / project.milestones;
            if (remainingAmount < milestoneAmount) revert MilestoneNotReached();

            uint256 cycle = votingCycle[msg.sender][_projectIndex];
            uint256 deadline = votingDeadline[msg.sender][_projectIndex][cycle];
            if (block.timestamp <= deadline) revert VotingCycleGoingOn();
            if (block.timestamp <= deadline + VOTING_COOLDOWN) revert OnCooldown();

            votingCycle[msg.sender][_projectIndex] += 1;
            cycle = votingCycle[msg.sender][_projectIndex];
            votingDeadline[msg.sender][_projectIndex][cycle] = block.timestamp + VOTING_DEADLINE;
        }
        else {
            uint256 cycle = votingCycle[msg.sender][_projectIndex];
            uint256 deadline = votingDeadline[msg.sender][_projectIndex][cycle];
            if (block.timestamp <= deadline) revert VotingCycleNotEnded();

            uint256 votesGathered = votes[msg.sender][_projectIndex][cycle];
            uint256 requiredVotes = (investorCount[msg.sender][_projectIndex] * REQUIRED_VOTES) / 100;
            if (votesGathered >= requiredVotes) {
                _releaseFunds(project, _amount, _to);
            }
            else revert NotEnoughVotes();
        }
    }

    function _releaseFunds(
        Project storage _project,
        uint256 _amount,
        address _to
    ) internal {
        _project.released += _amount;
        (bool sent, ) = payable(_to).call{value: _amount}("");
        if (!sent) revert EthereumTransferFailed();

        emit ProjectFundsReleased(
            msg.sender,
            _project.index,
            _amount,
            _to,
            block.timestamp
        );
    }

    function abandonProject(uint256 _projectIndex) external {
        if (projectCount[msg.sender] < _projectIndex + 1) revert InvalidIndexInput();
        projectAbandoned[msg.sender][_projectIndex] = true;
    }

    function withdrawFunds(
        address _projectOwner,
        uint256 _projectIndex
    ) external payable {
        if (!projectAbandoned[_projectOwner][_projectIndex]) revert ProjectNotAbandoned();
        Project storage project = projects[_projectOwner][_projectIndex];
        uint256 investmentIndex = investmentCount[msg.sender];
        Investment storage investment = investments[msg.sender][investmentIndex];
        uint256 remainingAmount = project.funded - project.released;
        if (remainingAmount == 0) revert ProjectEmpty();
        if (remainingAmount < investment.amount) {
            (bool sent, ) = payable(msg.sender).call{value: remainingAmount}("");
            if (!sent) revert EthereumTransferFailed();
        }
        else {
            (bool sent, ) = payable(msg.sender).call{value: investment.amount}("");
            if (!sent) revert EthereumTransferFailed();
        }
    }
}
