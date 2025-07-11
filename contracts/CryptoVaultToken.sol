// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint32, externalEuint32 } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract CryptoVaultToken is SepoliaConfig {
    mapping(address => euint32) private _balances;
    euint32 private _totalSupply;

    function totalSupply() public view returns (euint32) {
        return _totalSupply;
    }

    function balanceOf(address account) public view returns (euint32) {
        return _balances[account];
    }

    function transfer(address recipient, externalEuint32 encryptedAmount, bytes calldata proof) public {
        euint32 amount = FHE.fromExternal(encryptedAmount, proof);
        _balances[msg.sender] = FHE.sub(_balances[msg.sender], amount);
        _balances[recipient] = FHE.add(_balances[recipient], amount);
        FHE.allowThis(_balances[msg.sender]);
        FHE.allowThis(_balances[recipient]);
        FHE.allow(_balances[msg.sender], msg.sender);
        FHE.allow(_balances[recipient], recipient);
    }

    function mint(externalEuint32 encryptedAmount, bytes calldata proof) public {
        euint32 amount = FHE.fromExternal(encryptedAmount, proof);
        _totalSupply = FHE.add(_totalSupply, amount);
        _balances[msg.sender] = FHE.add(_balances[msg.sender], amount);
        FHE.allowThis(_totalSupply);
        FHE.allowThis(_balances[msg.sender]);
        FHE.allow(_totalSupply, msg.sender);
        FHE.allow(_balances[msg.sender], msg.sender);
    }
}
