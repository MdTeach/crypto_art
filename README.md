# ART Generation NFT Platform

A simple ART generation NFT platform where image is genrated by the AI model.

## Demo

(video thumbnail below)
[![Video](https://img.youtube.com/vi/PZ4mBEuT730/0.jpg)](https://www.youtube.com/watch?v=PZ4mBEuT730)

## Setup GuideLines

Assuming truffle is installed, the following commands will install the dependencies and run the tests:

1. `npm install`
2. To run test run `truffle test` ensuring **ganache** instance is running.
3. Add infura endpoint in `sercets.json` for Rinkeby testnet.
4. `truffle migrate`
5. `npm run rink` to deploy to the testnet.
6. `cd client/ && npm install && npm start` to run the client. Makesure that the metamask is conneted to the rinkeby testnet.

## Image Generation

Image generated is a simple 128X128, the model traning code file is documented [here](https://www.kaggle.com/mdteach/pytorch-dcgan-art-generation) and simple Flask server used to serve the model is documented [here](https://gist.github.com/MdTeach/6ff70f7f5a8fb32b32652f9c68224ebb).
