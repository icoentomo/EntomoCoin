var ENToken = artifacts.require("./ENToken.sol"),
    Crowdsale = artifacts.require("./Crowdsale.sol"),
    MultiSigWallet = artifacts.require("./MultiSigWallet.sol");

var eth = web3.eth,
    owner = eth.accounts[0],
    wallet = eth.accounts[1],
    buyer = eth.accounts[2],
    buyer2 = eth.accounts[3],
    totalTokensSold = 0,
    buyerTokenBalance = 0,
    buyer2TokenBalance = 0;

var totalSupply = 1300000,
    totalTokenForSale = 1300000,
    maxCap = totalTokenForSale;


const timeTravel = function (time) {
    return new Promise((resolve, reject) => {
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_increaseTime",
            params: [time], // 86400 is num seconds in day
            id: new Date().getTime()
        }, (err, result) => {
            if (err) { return reject(err) }
            return resolve(result)
        });
    })
}

const mineBlock = function () {
    return new Promise((resolve, reject) => {
        web3.currentProvider.sendAsync({
            jsonrpc: "2.0",
            method: "evm_mine"
        }, (err, result) => {
            if (err) { return reject(err) }
            return resolve(result)
        });
    })
}

var printBalance = async function () {
    const ownerBalance = web3.eth.getBalance(owner);
    const walletBalance = web3.eth.getBalance(wallet);
    const buyerBalance = web3.eth.getBalance(buyer);
    const crowdsaleBalance = web3.eth.getBalance(Crowdsale.address);

    let token = await ENToken.deployed();
    let balance = await token.balanceOf.call(owner);
    console.log("Owner balance: ", web3.fromWei(ownerBalance, "ether").toString(), " ETHER / ", web3.fromWei(balance.valueOf(), "ether").toString(), " ENT");
    balance = await token.balanceOf.call(buyer);
    console.log("Buyer balance: ", web3.fromWei(buyerBalance, "ether").toString(), " ETHER / ", web3.fromWei(balance.valueOf(), "ether").toString(), " ENT");
    balance = await token.balanceOf.call(Crowdsale.address);
    console.log("Crowdsale balance: ", web3.fromWei(crowdsaleBalance, "ether").toString(), " ETHER / ", web3.fromWei(balance.valueOf(), "ether").toString(), " ENT");
    balance = await token.balanceOf.call(wallet);
    console.log("wallet balance: ", web3.fromWei(walletBalance, "ether").toString(), " ETHER / ", web3.fromWei(balance.valueOf(), "ether").toString(), " ENT");
}

contract('ICO', function (accounts) {
    var investEther = async function (sum, from) {
        var investSum = web3.toWei(sum, "ether");

        let ico = await Crowdsale.deployed();
        let txn = await ico.sendTransaction({ from: from, to: ico.address, value: investSum });
        let token = await ENToken.deployed();
        let balance = await token.balanceOf.call(from);
        return balance;
    }

    it("should remain 0 ENToken in the first account", async function () {
        await printBalance();
        let token = await ENToken.deployed();
        let balance = await token.balanceOf.call(owner);
        assert.equal(web3.fromWei(balance.valueOf()), 0, "0 wasn't in the first account");
    });

    it("should have " + maxCap + " ENToken in Crowdsale contract", async function () {
        let token = await ENToken.deployed();
        let balance = await token.balanceOf.call(Crowdsale.address);
        assert.equal(web3.fromWei(balance.valueOf()), maxCap, maxCap + " wasn't in the Crowdsale account")
    });

    it("Should not deposit less than 0.001 ETH", async function () {
        try {
            let balance = await investEther(0.0001, buyer);
        } catch (e) {
            return true;
        }
        throw new Error("I should never see this!")
    });
    /** 
       it("Should not buy more than all tokens", async function () {
           let secToTravel = (new Date("Sep 27 2018 00:00:03 GMT").getTime() - Date.now()) / 1000;
           await timeTravel(Math.floor(secToTravel));  //go to no bonus zone
           let balanceOld = web3.fromWei(web3.eth.getBalance(buyer), 'ether').valueOf()
           console.log('balanceOld',balanceOld)
           let balance = await investEther(6000, buyer); // should refund 800 ETH, max is 5200 ETH
           let balanceNew = web3.fromWei(web3.eth.getBalance(buyer), 'ether').valueOf()
           console.log('balanceNew',balanceNew)
           totalTokensSold = 1300000 * 10 ** 18;
           buyerTokenBalance = 1300000 * 10 ** 18;
           assert.equal(balance.valueOf(), buyerTokenBalance, buyerTokenBalance + " wasn't in the buyer account.");
           assert.equal(balanceOld - balanceNew, 5200, "Refund didnt work.");
       });
    */

    it("Should Buy 250 tokens + 25% on week 1 -> 312.5 tokens", async function () {
        let secToTravel = (new Date("Jun 18 2018 00:00:03 GMT").getTime() - Date.now()) / 1000;
        await timeTravel(Math.floor(secToTravel));
        let balance = await investEther(1, buyer);
        totalTokensSold += 312.5 * 10 ** 18;
        buyerTokenBalance += 312.5 * 10 ** 18;
        assert.equal(balance.valueOf(), buyerTokenBalance, "312.5 wasn't in the buyer account.");
    });

    it("Should not be able to purchase token between preICO and ICO", async function () {
        await timeTravel(86400 * 25); // 25 days later (end of preICO)
        await mineBlock(); // workaround for https://github.com/ethereumjs/testrpc/issues/336
        try {
            let balance = await investEther(1, buyer);
        } catch (e) {
            return true;
        }
        throw new Error("I should never see this!")
    });

    it("Should Buy 250 + 15% on week 1 -> 287.5 tokens", async function () {
        await timeTravel(86400 * 59);  // 59 days later (beginning of ICO)
        await mineBlock(); // workaround for https://github.com/ethereumjs/testrpc/issues/336
        let balance = await investEther(1, buyer);
        totalTokensSold += 287.5 * 10 ** 18;
        buyerTokenBalance += 287.5 * 10 ** 18;
        assert.equal(balance.valueOf(), buyerTokenBalance, buyerTokenBalance + " wasn't in the buyer account.");
    });

    it("Should Buy 250 + 10% on week 1 -> 275 tokens", async function () {
        await timeTravel(86400 * 7);  // one week later
        await mineBlock(); // workaround for https://github.com/ethereumjs/testrpc/issues/336
        let balance = await investEther(1, buyer);
        totalTokensSold += 275 * 10 ** 18;
        buyerTokenBalance += 275 * 10 ** 18;
        assert.equal(balance.valueOf(), buyerTokenBalance, buyerTokenBalance + " wasn't in the buyer account.");
    });

    it("Should Buy 250 with no bonus", async function () {
        await timeTravel(86400 * 7);  // one week later
        await mineBlock(); // workaround for https://github.com/ethereumjs/testrpc/issues/336
        let balance = await investEther(1, buyer);
        totalTokensSold += 250 * 10 ** 18;
        buyerTokenBalance += 250 * 10 ** 18;
        assert.equal(balance.valueOf(), buyerTokenBalance, buyerTokenBalance + " wasn't in the buyer account.");
    });

    it("Should not be able to purchase token after ICO", async function () {
        await timeTravel(86400 * 7); // 7 days later, ICO finished
        await mineBlock(); // workaround for https://github.com/ethereumjs/testrpc/issues/336
        try {
            let balance = await investEther(1, buyer);
        } catch (e) {
            return true;
        }
        throw new Error("I should never see this!")
    });

    it("Should transfer 10 tokens from buyer to buyer2", async function () {
        let token = await ENToken.deployed();
        let txn = await token.transfer(buyer2, 10 * 10 ** 18, { from: buyer });
        let balance = await token.balanceOf.call(buyer);
        let balance2 = await token.balanceOf.call(buyer2);
        buyerTokenBalance -= 10 * 10 ** 18;
        buyer2TokenBalance += 10 * 10 ** 18;
        assert.equal(balance.valueOf(), buyerTokenBalance, "10 ENT wasn't removed from buyer account.");
        assert.equal(balance2.valueOf(), buyer2TokenBalance, "10 ENT wasn't transfered to buyer2 account.");
    });

    it("Should burn the remaining tokens", async function () {
        let token = await ENToken.deployed();
        let ico = await Crowdsale.deployed();
        let txn = await ico.burnRemainingTokens({ from: owner });
        let balance = await token.balanceOf.call(Crowdsale.address);
        assert.equal(balance.valueOf(), 0, "Crowdsale contract still have tokens.");
        await printBalance();
    });

    it("Transfer funds from multisig to accounts[8]", async function () {

        let balanceOld = await web3.eth.getBalance(web3.eth.accounts[8]).valueOf()

        let multiSig = await MultiSigWallet.deployed();
        let txId = await multiSig.submitTransaction(web3.eth.accounts[8], web3.eth.getBalance(MultiSigWallet.address), null, { from: web3.eth.accounts[5], gas: 200000 });

        let tx = await multiSig.confirmTransaction(0, { from: web3.eth.accounts[6], gas: 600000 });
        let balance = await web3.eth.getBalance(web3.eth.accounts[8]).valueOf()
        console.log(balance)
        assert.equal(web3.fromWei(balance - balanceOld, 'ether'), 4, "balance not 4 eth");

    });

});
