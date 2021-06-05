import React, { useEffect, useState } from "react";
import axios from "axios";

interface ImageRes {
  image: string;
}

function App() {
  const [image, setImage] = useState("");

  useEffect(() => {
    (async () => {
      const response = await axios.get("http://127.0.0.1:5000/");
      const imageData: ImageRes = response.data;
      setImage(imageData.image);
      // let img = new ImageData(imageData.image);
    })();
  }, []);

  return (
    <div className="App">
      <header className="App-header">Abishek Bashyal</header>
      {image !== "" ? (
        <img
          src={`data:image/jpeg;base64,${image}`}
          alt="generator"
          style={{ width: "300px", height: "300px" }}
        />
      ) : null}
    </div>
  );
}

export default App;
