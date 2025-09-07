// sharedElectionData.js
let sharedElectionData = {
    address: '0xa579675518D32c99B6f1929AFe8397d42D896f84',
    name: 'Annual Board Election',
    description: 'Election for Board of Directors 2023',
    voters: 150,
    candidates: 5,
    totalVotes: 120,
    candidateData: [
        {
            email: 'john.doe@company.com',
            name: 'John Doe',
            position: 'CEO',
            votes: 45,
            bio: 'Experienced leader with 10+ years in industry'
        },
        {
            email: 'jane.smith@company.com',
            name: 'Jane Smith',
            position: 'CTO',
            votes: 38,
            bio: 'Technology innovator and strategic thinker'
        },
        {
            email: 'robert.johnson@company.com',
            name: 'Robert Johnson',
            position: 'CFO',
            votes: 22,
            bio: 'Financial expert with proven track record'
        },
        {
            email: 'sarah.williams@company.com',
            name: 'Sarah Williams',
            position: 'COO',
            votes: 10,
            bio: 'Operations specialist focused on efficiency'
        },
        {
            email: 'michael.brown@company.com',
            name: 'Michael Brown',
            position: 'CMO',
            votes: 5,
            bio: 'Marketing guru with creative vision'
        }
    ],
    electionStatus: 'active',
    startDate: '2023-10-01',
    endDate: '2023-10-15'
};

export const getSharedElectionData = () => {
    return { ...sharedElectionData }; // Return a copy to prevent direct mutation
};

export const updateSharedElectionData = (newData) => {
    sharedElectionData = { ...sharedElectionData, ...newData };
    return sharedElectionData;
};

export const addCandidateToSharedData = (candidate) => {
    const newCandidate = {
        ...candidate,
        votes: candidate.votes || 0,
        bio: candidate.bio || "New candidate"
    };

    sharedElectionData.candidateData.push(newCandidate);
    sharedElectionData.candidates = sharedElectionData.candidateData.length;

    // Update the total votes
    sharedElectionData.totalVotes = sharedElectionData.candidateData.reduce(
        (total, candidate) => total + candidate.votes, 0
    );

    return sharedElectionData;
};

export const resetSharedElectionData = () => {
    sharedElectionData = {
        address: '0xa579675518D32c99B6f1929AFe8397d42D896f84',
        name: 'Annual Board Election',
        description: 'Election for Board of Directors 2023',
        voters: 150,
        candidates: 5,
        totalVotes: 120,
        candidateData: [
            {
                email: 'john.doe@company.com',
                name: 'John Doe',
                position: 'CEO',
                votes: 45,
                bio: 'Experienced leader with 10+ years in industry'
            },
            {
                email: 'jane.smith@company.com',
                name: 'Jane Smith',
                position: 'CTO',
                votes: 38,
                bio: 'Technology innovator and strategic thinker'
            },
            {
                email: 'robert.johnson@company.com',
                name: 'Robert Johnson',
                position: 'CFO',
                votes: 22,
                bio: 'Financial expert with proven track record'
            },
            {
                email: 'sarah.williams@company.com',
                name: 'Sarah Williams',
                position: 'COO',
                votes: 10,
                bio: 'Operations specialist focused on efficiency'
            },
            {
                email: 'michael.brown@company.com',
                name: 'Michael Brown',
                position: 'CMO',
                votes: 5,
                bio: 'Marketing guru with creative vision'
            }
        ],
        electionStatus: 'active',
        startDate: '2023-10-01',
        endDate: '2023-10-15'
    };

    return sharedElectionData;
};