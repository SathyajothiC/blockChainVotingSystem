const Election = artifacts.require("Election");

module.exports = function (deployer) {
    // NO PARAMETERS - constructor takes nothing
    deployer.deploy(Election);
};