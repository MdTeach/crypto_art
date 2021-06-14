import React, {useEffect, useState} from 'react';
import axios from 'axios';

interface ImageRes {
  image: string;
}

function App() {
  const [image, setImage] = useState('');

  const fetchImage = async () => {
    const response = await axios.get('http://127.0.0.1:5000/');
    const imageData: ImageRes = response.data;
    setImage(imageData.image);
  };

  useEffect(() => {
    console.log('Effect call');
    fetchImage();
  }, []);

  return (
    <div className="App" style={{textAlign: 'center'}}>
      <h2 className="App-header">Crypto Art</h2>
      {image !== '' ? (
        <img
          src={`data:image/jpeg;base64,${image}`}
          alt="generator"
          style={{width: '175px', height: '175px'}}
        />
      ) : null}
      <br />
      <button onClick={fetchImage}>Generate Another</button>
    </div>
  );
}

export default App;
