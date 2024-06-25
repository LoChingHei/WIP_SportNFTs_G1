// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract WorldCup is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 public mintPrice = 0.05 ether; // Example mint price

    // Mapping from team name to team balance
    mapping(string => uint256) public teamBalances;

    constructor() ERC721("World Cup", "WCT") {}

    function mint(string memory tokenURI, string memory team) public payable returns (uint256) {
        require(msg.value >= mintPrice, "Insufficient funds to mint NFT");

        // Increment the token ID counter
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        // Mint the NFT
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);

        // Add the funds to the specified team's balance
        teamBalances[team] += msg.value;

        return newItemId;
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIds.current();
    }

    // Withdraw function for the owner to withdraw funds for a specific team
    function withdrawTeamFunds(string memory team) public onlyOwner {
        uint256 balance = teamBalances[team];
        require(balance > 0, "No funds available for this team");

        teamBalances[team] = 0;
        payable(owner()).transfer(balance);
    }

    // Generic withdraw function for the contract owner
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }

    receive() external payable {}
}
