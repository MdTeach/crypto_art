// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import './ArtNFT.sol';

contract TradeNFT {
    ArtNFT private artNFT;
    mapping(uint256 => uint256) tokensForSale;

    event ListedForSale(uint256 _tokenId, uint256 _sellingPrice);

    modifier OnlyTokenOwner(uint256 _tokenId, address _user) {
        require(
            _user == artNFT.ownerOf(_tokenId),
            'Err: only token owner can execute this'
        );
        _;
    }

    function listForSale(uint256 _tokenId, uint256 _sellingPrice)
        public
        OnlyTokenOwner(_tokenId, msg.sender)
        returns (bool)
    {
        require(_sellingPrice != 0, 'Err: Cannot sale for zero value');
        // token is not for sale already
        require(
            tokensForSale[_tokenId] == 0,
            'Err: Contract is already for sale'
        );
        // contract has permission to sale
        require(
            artNFT.getApproved(_tokenId) == address(this),
            'Err: Contract is not given approval to sale the token'
        );

        tokensForSale[_tokenId] = _sellingPrice;
        emit ListedForSale(_tokenId, _sellingPrice);
        return true;
    }

    function buyToken(uint256 _tokenId) public payable returns (bool) {
        uint256 _price = tokensForSale[_tokenId];
        require(msg.value >= _price, 'Err: value sent insufficent to buy');
        require(_price > 0, 'Err: token is not listed for sale');

        // send ether to the seller
        address payable _seller = payable(artNFT.ownerOf(_tokenId));
        _seller.transfer(_price);

        // tranfer NFT to the buyer
        artNFT.safeTransferFrom(_seller, msg.sender, _tokenId);
        return true;
    }

    function getItemPrice(uint256 _tokenId) public view returns (uint256) {
        require(
            tokensForSale[_tokenId] != 0,
            'Err: The item is not listed for sale'
        );

        return tokensForSale[_tokenId];
    }

    constructor(ArtNFT _artNFT) {
        artNFT = _artNFT;
    }
}
