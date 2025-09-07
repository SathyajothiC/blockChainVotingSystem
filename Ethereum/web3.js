import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    // Modern dapp browsers (MetaMask v10+)
    web3 = new Web3(window.ethereum);

    // Wrap in async IIFE to use await
    (async function () {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error("User denied account access");
        }
    })();
} else {
    // Fallback for old MetaMask/localhost
    console.log('Using fallback web3 provider');
    const provider = new Web3.providers.HttpProvider('http://localhost:7545');
    web3 = new Web3(provider);
}

export default web3;