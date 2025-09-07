// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Election {
    address public election_authority = 0xa579675518D32c99B6f1929AFe8397d42D896f84;
    string public election_name = "2024 Presidential Election";
    string public election_description = "Vote for your favorite candidate";
    bool public status = true;
    
    struct Candidate {
        string name;
        string description;
        string imgHash;
        uint8 voteCount;
        string email;
    }
    
    struct Voter {
        uint8 candidateIdVoted;
        bool voted;
    }
    
    mapping(uint8 => Candidate) public candidates;
    mapping(string => Voter) public voters;
    
    uint8 public numCandidates = 0;
    uint8 public numVoters = 0;

    event ElectionCreated(address indexed authority);
    event CandidateAdded(uint8 indexed candidateId);
    event VoteCast(address indexed voter, uint8 candidateId);

    constructor() {
        // ABSOLUTELY NO LOGIC THAT CAN FAIL
        election_authority = msg.sender;
        emit ElectionCreated(msg.sender);
        
        // Pre-add some test candidates
        _addTestCandidates();
    }
    
    function _addTestCandidates() private {
        candidates[0] = Candidate("Candidate A", "Description A", "hash1", 0, "a@test.com");
        candidates[1] = Candidate("Candidate B", "Description B", "hash2", 0, "b@test.com");
        numCandidates = 2;
    }

    // REMOVE ALL REQUIRE STATEMENTS
    function addCandidate(
        string memory name, 
        string memory description, 
        string memory imgHash,
        string memory email
    ) external {
        // NO REQUIRE STATEMENTS
        uint8 candidateId = numCandidates++;
        candidates[candidateId] = Candidate(name, description, imgHash, 0, email);
        emit CandidateAdded(candidateId);
    }

    function vote(uint8 candidateId, string memory voterEmail) external {
        // NO REQUIRE STATEMENTS - JUST EXECUTE
        voters[voterEmail] = Voter(candidateId, true);
        candidates[candidateId].voteCount++;
        numVoters++;
        emit VoteCast(msg.sender, candidateId);
    }

    function getCandidate(uint8 candidateId) public view returns (
        string memory name,
        string memory description,
        string memory imgHash,
        uint8 voteCount,
        string memory email
    ) {
        Candidate storage c = candidates[candidateId];
        return (c.name, c.description, c.imgHash, c.voteCount, c.email);
    } 

    function winnerCandidate() public view returns (uint8) {
        uint8 winningId = 0;
        uint8 maxVotes = candidates[0].voteCount;
        
        for(uint8 i = 1; i < numCandidates; i++) {
            if(candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winningId = i;
            }
        }
        return winningId;
    }
    
    function closeElection() external {
        status = false;
    }
}