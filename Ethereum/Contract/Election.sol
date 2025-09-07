// SPDX-License-Identifier: MIT
pragma  ^0.8.21;

contract Election {
    address public immutable election_authority;  // Made immutable
    string public election_name;
    string public election_description;
    bool public status;
    
    struct Candidate {
        string name;           // Shortened name
        string description;
        string imgHash;
        uint8 voteCount;
        string email;
    }
    
    struct Voter {
        uint8 candidateIdVoted;  // camelCase naming
        bool voted;
    }
    
    mapping(uint8 => Candidate) public candidates;
    mapping(string => Voter) public voters;
    
    uint8 public numCandidates;
    uint8 public numVoters;

    event ElectionCreated(address indexed authority);
    event CandidateAdded(uint8 indexed candidateId);
    event VoteCast(address indexed voter, uint8 candidateId);

    constructor(address authority, string memory name, string memory description) {
        require(authority != address(0), "Invalid authority address");
        election_authority = authority;
        election_name = name;
        election_description = description;
        status = true;
        
        emit ElectionCreated(authority);
    }

    modifier onlyOwner() {  // Renamed for clarity
        require(msg.sender == election_authority, "Unauthorized");
        _;
    }

    function addCandidate(
        string memory name, 
        string memory description, 
        string memory imgHash,
        string memory email
    ) external onlyOwner {  // Changed to external
        require(bytes(name).length > 0, "Name required");
        
        uint8 candidateId = numCandidates++;
        candidates[candidateId] = Candidate({
            name: name,
            description: description,
            imgHash: imgHash,
            voteCount: 0,
            email: email
        });
        
        emit CandidateAdded(candidateId);
    }

    function vote(uint8 candidateId, string memory voterEmail) external {
        
         require(status, "Election is not active");
    require(bytes(voterEmail).length > 0, "Voter email required");
    require(!voters[voterEmail].voted, "You have already voted");
    require(candidateId < numCandidates, "Invalid candidate ID");
    
    
        require(!voters[voterEmail].voted, "Already voted");
        require(candidateId < numCandidates, "Invalid candidate");
        require(status, "Election closed");
        
        voters[voterEmail] = Voter(candidateId, true);
        candidates[candidateId].voteCount++;
        numVoters++;
        
        emit VoteCast(msg.sender, candidateId);
    }

    // View functions remain largely the same but with some improvements:

    function getCandidate(uint8 candidateId) public view returns (
        string memory name,
        string memory description,
        string memory imgHash,
        uint8 voteCount,
        string memory email
    ) {
        require(candidateId < numCandidates, "Invalid candidate");
        Candidate storage c = candidates[candidateId];
        return (c.name, c.description, c.imgHash, c.voteCount, c.email);
    } 

    function winnerCandidate() public view onlyOwner returns (uint8) {
        require(numCandidates > 0, "No candidates");
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
    
    // Additional useful function:
    function closeElection() external onlyOwner {
        status = false;
    }
}