interface MetaData {
  name: string;
  description: string;
  image: string;
  properties: {
    artist: string;
    inferenceTime: string | number;
  };
}

export interface MetaDataIndexed extends MetaData {
  token_id: string;
}

export default MetaData;
