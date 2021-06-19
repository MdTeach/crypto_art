import {create} from 'ipfs-http-client';
import MetaDataType from './MetaData';

const ipfs = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

const publishMetaData = async (metaData: MetaDataType) => {
  const dataStr = JSON.stringify(metaData);
  try {
    const {path} = await ipfs.add(dataStr);
    return [path, null];
  } catch (error) {
    return [null, error];
  }
};

const uploadToIPFS = async (image_base64: string) => {
  const imgBuffer = Buffer.from(image_base64, 'base64');
  try {
    const {path} = await ipfs.add(imgBuffer);
    return [path, null];
  } catch (error) {
    return [null, error];
  }
};

export {uploadToIPFS, publishMetaData};
