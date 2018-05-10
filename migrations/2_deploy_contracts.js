var ENToken = artifacts.require("./ENToken.sol");
var Crowdsale = artifacts.require("./Crowdsale.sol");
var MultiSigWallet = artifacts.require("./MultiSigWallet.sol");

module.exports = function (deployer) {

	maxCap = 1300000;
	//TODO change to real addresses of Entomo team
	return deployer.deploy(MultiSigWallet, [web3.eth.accounts[5], web3.eth.accounts[6]], 2).then(
		function () {
			console.log("MultiSigWallet address: " + MultiSigWallet.address);
			//deploy the ENToken using the owner account
			return deployer.deploy(ENToken).then(function () {
				//log the address of the ENToken
				console.log("ENToken address: " + ENToken.address);
				//deploy the Crowdsale contract
				return deployer.deploy(Crowdsale, ENToken.address, MultiSigWallet.address, web3.toWei(maxCap)).then(function () {
					console.log("Crowdsale address: " + Crowdsale.address);
					return ENToken.deployed().then(function (token) {
						return Crowdsale.deployed().then(function (crowdsale) {
							// send token to crowdsale contract
							return token.transfer(Crowdsale.address, web3.toWei(maxCap)).then(function () {
								return token.balanceOf.call(Crowdsale.address)
							});
						});
					});
				});
			});
		}
	);
};
