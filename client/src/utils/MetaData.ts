interface MetaData {
  name: String;
  description: String;
  image: String;
  properties: {
    artist: String;
    inferenceTime: String | number;
  };
}

export default MetaData;
