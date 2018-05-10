# ENToken

Repository for the Entomo token + ICO smart contracts

- contracts/Crowdsale.sol : code of ICO contract, sends you ENT tokens in exchange for ETH
- contracts/ENToken.sol : code of Entomofarm Token 
- contracts/MultiSigWallet.sol : Multi-signature wallet from gnosis project https://github.com/gnosis/MultiSigWallet/blob/master/contracts/MultiSigWallet.sol
- contracts/SafeMath.sol : code of standard maths library
- other contracts/*.sol : code of standard burnable ERC20 token 
- migrations/2_deploy_contracts.js : smart contracts deployer
- truffle.js : ethereum node address (IP:PORT)
- test/ENToken.js : unit tests (done with ganache tool)



install truffle framework to compile migrate and run tests

start ganache then:

```
truffle migrate --reset 
truffle test 
```


## Metrics 
- pre-ICO dates : 18 june 2018 - 10 july 2018 (25 days)
- ICO dates : 10 - 28 september 2018  (18 days)
- token price = 4€
- 1 ETH = 600€ 
- *1 ETH = 250 ENT*
- Bonus : 
    - pre ICO : 25%
    - 1st week ICO : 15%
    - 2nd week ICO : 10%
    - 3rd week ICO : no bonus
- All unsold token are burnt at the end of the ICO