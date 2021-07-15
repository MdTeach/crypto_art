# ART Generation NFT Platform

A simple ART generation NFT platform where image is genrated by the AI model.

## Demo

[![Video](https://img.youtube.com/vi/PZ4mBEuT730/0.jpg)](https://www.youtube.com/watch?v=PZ4mBEuT730)

## Setup GuideLines

Assuming truffle is installed, the following commands will install the dependencies and run the tests:

1. `npm install`
2. To run test run `truffle test` ensuring **ganache** instance is running.
3. Add infura endpoint in `sercets.json` for Rinkeby testnet.
4. `truffle migrate`
5. `npm run rink` to deploy to the testnet.
6. `cd client/ && npm install && npm start` to run the client. Makesure that the metamask is conneted to the rinkeby testnet.
