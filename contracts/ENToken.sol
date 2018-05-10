//ERC20 Token
pragma solidity ^0.4.15;

import './BurnableToken.sol';
import './Ownable.sol';

contract ENToken is BurnableToken, Ownable {

    string public constant name = "EntomoCoin";
    string public constant symbol = "ENT";
    uint public constant decimals = 18;
    uint256 public constant initialSupply = 1300000 * (10 ** uint256(decimals));

    // Constructor
    function ENToken() {
        totalSupply = initialSupply;
        balances[msg.sender] = initialSupply; // Send all tokens to owner
    }
}
