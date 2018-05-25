## Entomo Farm Bug Bounty Program
Thank you for visiting the Entomo Farm Bug Bounty.

Successful bug hunters will be rewarded with up to $5,000 in ether. Below you'll find all the details on this program.

If you've already read this information and have found a bug you'd like to submit to Entomo Farm for review, please use this form:

### [Submit a Bug](https://docs.google.com/forms/d/1rZ4oBVH3qCXadQ_67tEC02IdyObGpk-bW2CywzoqG0k/edit)

### Rewards
Paid out Rewards in ether are guided by the Severity category and the Quality of the submission, determined at the sole discretion of Entomo Farm, and payable at the end of the ICO.

* Critical: Up to $5,000
* High: Up to $3,000
* Medium: Up to $2,000
* Low: Up to $400

Quality of the submission includes (but not limited to):

* Quality of Description, Attack Scenario & Components: Clear and well-written descriptions will receive higher rewards.
* Quality of Reproduction: Include test code, scripts and detailed instructions. The easier it is for us to reproduce and verify the vulnerability, the higher the reward.
* Quality of Fix: Higher rewards are paid for submissions with clear instructions to fix the vulnerability.

### Rules
* Issues that have already been submitted by another user or are already known to Entomo Farm are not eligible for bounty rewards
* Public disclosure of a vulnerability without Entomo Farm’s prior consent results in ineligibility for a bounty
* Determinations of eligibility, award, and all terms related to an award are at the sole and final discretion of Entomo Farm. 
* Decisions are guided by the submision's Impact, Likelihood and Quality

### Running the tests
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

Install truffle framework to compile migrate and run tests

Start ganache then:

```
truffle migrate --reset 
truffle test 
```

## ENToken

Repository for the Entomo token + ICO smart contracts

- contracts/Crowdsale.sol : code of ICO contract, sends you ENT tokens in exchange for ETH
- contracts/ENToken.sol : code of Entomofarm Token 
- contracts/MultiSigWallet.sol : Multi-signature wallet from gnosis project https://github.com/gnosis/MultiSigWallet/blob/master/contracts/MultiSigWallet.sol
- contracts/SafeMath.sol : code of standard maths library
- other contracts/*.sol : code of standard burnable ERC20 token 
- migrations/2_deploy_contracts.js : smart contracts deployer
- truffle.js : ethereum node address (IP:PORT)
- test/ENToken.js : unit tests (done with ganache tool)

## Metrics 
- pre-ICO dates : 18 june 2018 - 10 july 2018 (25 days)
- ICO dates : 10 - 28 september 2018  (18 days)
- tokens for sale : 1,300,000
- token price = 4€
- 1 ETH = 600€ 
- *1 ETH = 250 ENT*
- Bonus : 
    - pre ICO : 25%
    - 1st week ICO : 15%
    - 2nd week ICO : 10%
    - 3rd week ICO : no bonus
- All unsold token are burnt at the end of the ICO
