// sampleElectionData.js
export const SAMPLE_ELECTION = {
    address: '0xa579675518D32c99B6f1929AFe8397d42D896f84',
    name: 'Annual Board Election',
    description: 'Election for Board of Directors 2023',
    adminEmail: 'company@example.com',
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
    voterData: [
        { email: 'voter1@company.com', hasVoted: true },
        { email: 'voter2@company.com', hasVoted: true },
        { email: 'voter3@company.com', hasVoted: false },
        // ... more voters
    ],
    electionStatus: 'active', // active, completed, pending
    startDate: '2023-10-01',
    endDate: '2023-10-15'
};

export default SAMPLE_ELECTION;