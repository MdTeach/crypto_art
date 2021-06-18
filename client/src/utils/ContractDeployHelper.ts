const getContractAddress = (abiJson: any, networkId: any): string => {
  const address: string = abiJson.networks[networkId].address;
  return address;
};

export {getContractAddress};
