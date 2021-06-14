// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';

contract ArtNFT is ERC721 {
    uint256 public tokenCounter;
    mapping(uint256 => string) private _tokenURIs;
    string private _baseURL = 'https://ipfs.io/ipfs/';

    constructor() ERC721('CryptoArt', 'CART') {
        tokenCounter = 0;
    }

    function _setTokenURI(uint256 _tokenId, string memory _tokenURI) internal {
        require(
            _exists(_tokenId),
            'ERC721Metadata: URI set of nonexistent token'
        );
        _tokenURIs[_tokenId] = _tokenURI;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(_tokenId),
            'ERC721Metadata: URI query for nonexistent token'
        );
        string memory _tokenURI = _tokenURIs[_tokenId];
        string memory data = string(abi.encodePacked(_baseURL, _tokenURI));
        return data;
    }

    // user mint the token given the tokenURI
    function createCollectible(string memory _tokenURI)
        public
        returns (uint256)
    {
        uint256 newItemId = tokenCounter;
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, _tokenURI);
        tokenCounter = tokenCounter + 1;
        return newItemId;
    }
}
