interface MetaData {
  name: string;
  description: string;
  image: string;
  properties: {
    artist: string;
    inferenceTime: string | number;
  };
}

export default MetaData;
