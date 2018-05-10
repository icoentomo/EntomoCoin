pragma solidity ^0.4.15;

import "./ENToken.sol";

contract Crowdsale is Ownable {
    using SafeMath for uint256;

    // address where funds are collected
    address public multisigVault;

    ENToken public coin;

    // start and end timestamps where investments are allowed (both inclusive)
    uint256 public preIcoStartTime;
    uint256 public preIcoEndTime;
    uint256 public icoStartTime;
    uint256 public icoEndTime;    
    // amount of raised money in wei
    uint256 public weiRaised;
    // amount of tokens sold
    uint256 public tokensSold;
    // max amount of token for sale during ICO
    uint256 public maxCap;
    // 250 ENT for 1 ETH 
    uint256 constant ENT_IN_ETH = 250;

    /**
    * event for token purchase logging
    * @param purchaser who paid for the tokens
    * @param beneficiary who got the tokens
    * @param value weis paid for purchase
    * @param amount of tokens purchased
    */
    event TokenPurchase(address indexed purchaser, address indexed beneficiary, uint256 value, uint256 amount);

    function Crowdsale(address _ENToken, address _to, uint256 _maxCap) {
        coin = ENToken(_ENToken);
        multisigVault = _to;
        maxCap = _maxCap;
        
        preIcoStartTime = 1529280001; // new Date("JUN 18 2018 00:00:01 GMT").getTime() / 1000
        preIcoEndTime = preIcoStartTime + 25 days; // approx 4 weeks pre ICO until 10 july 2018
        icoStartTime = 1536537601; //new Date("Sep 10 2018 00:00:01 GMT").getTime() / 1000
        icoEndTime = icoStartTime + 18 days; // 3 weeks ICO
    }

    // fallback function can be used to buy tokens
    function () payable {
        buyTokens(msg.sender);
    }

    // allow owner to modify address of wallet
    function setMultiSigVault(address _multisigVault) public onlyOwner {
        require(_multisigVault != address(0));
        multisigVault = _multisigVault;
    }

    // compute amount of token based on 1 ETH = 200 ENT
    function getTokenAmount(uint256 _weiAmount) internal returns(uint256) {
        // minimum deposit amount is 0.001 ETH
        if (_weiAmount < 0.001 * (10 ** 18)) {
          return 0;
        }

        uint256 tokens = _weiAmount.mul(ENT_IN_ETH);
        // compute bonus
        if(now > preIcoStartTime && now < preIcoEndTime) {
            tokens += (tokens * 25) / 100; // 25% for preICO
        } else if(now < icoStartTime + 7 * 1 days) {
            tokens += (tokens * 15) / 100; // 15% for first week preICO
        }else if(now < icoStartTime + 14 * 1 days) {
            tokens += (tokens * 10) / 100; // 10% for second week
        }
        return tokens;
    }

    // low level token purchase function
    function buyTokens(address beneficiary) payable {
        require(beneficiary != 0x0);
        require(msg.value != 0);
        require(!hasEnded());
        require(( now > preIcoStartTime && now < preIcoEndTime ) || ( now > icoStartTime && now < icoEndTime ));

        uint256 weiAmount = msg.value;
        uint256 refundWeiAmount = 0;

        // calculate token amount to be sent
        uint256 tokens = getTokenAmount(weiAmount);
        require(tokens > 0);

        // check if we are over maxCap
        if (tokensSold + tokens > maxCap) {
          // send remaining tokens to user
          uint256 overSoldTokens = (tokensSold + tokens) - maxCap;
          refundWeiAmount = weiAmount * overSoldTokens / tokens;
          weiAmount = weiAmount - refundWeiAmount;
          tokens = tokens - overSoldTokens;
        }

        // update state
        weiRaised = weiRaised.add(weiAmount);
        tokensSold = tokensSold.add(tokens);

        coin.transfer(beneficiary, tokens);
        TokenPurchase(msg.sender, beneficiary, weiAmount, tokens);
        multisigVault.transfer(weiAmount);

        // return extra ether to last user
        if (refundWeiAmount > 0) {
          beneficiary.transfer(refundWeiAmount);
        }
    }

    // @return true if crowdsale event has ended
    function hasEnded() public constant returns (bool) {
        return now > icoEndTime || tokensSold >= maxCap;
    }

    // Finalize crowdsale buy burning the remaining tokens
    // can only be called when the ICO is over
    function finalizeCrowdsale() {
        require(hasEnded());
        require(coin.balanceOf(this) > 0);

        coin.burn(coin.balanceOf(this));
    }
}
