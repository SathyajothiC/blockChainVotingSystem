import web3 from './web3';
import Election from './Build/Election.json';

// Debug: Check what's in the Election import
console.log('Election contract data:', Election);
console.log('Election.abi:', Election.abi);

// Use the abi property instead of interface
const contractABI = Election.abi;

if (!contractABI || !Array.isArray(contractABI)) {
    console.error('No valid ABI found in Election.json');
    throw new Error('Contract ABI is missing or invalid. Please check your contract compilation.');
}

export default address => {
    try {
        return new web3.eth.Contract(
            contractABI, // Use the abi property
            address
        );
    } catch (error) {
        console.error("Error creating contract instance:", error);
        throw new Error("Failed to create election contract instance");
    }
};