import web3 from './web3';
import ElectionFactory from './Build/ElectionFact.json';


const contractABI = ElectionFactory.abi ||
    (ElectionFactory.interface && JSON.parse(ElectionFactory.interface)) ||
    (ElectionFactory.compilerOutput && ElectionFactory.compilerOutput.abi);

if (!contractABI) {
    throw new Error(`
    No ABI found in contract JSON. Check your compilation output.
    Available keys: ${Object.keys(ElectionFactory).join(', ')}
  `);
}

const CONTRACT_ADDRESS = '0x68fB0FbF52d2b5b14451bE10a1FDe220b428f450';

const instance = new web3.eth.Contract(
    contractABI,
    CONTRACT_ADDRESS
);

// Verify contract methods
console.log('Contract methods:', Object.keys(instance.methods));

export default instance;