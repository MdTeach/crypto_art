import useWeb3 from './hooks/web3';

import GenerateLayout from './componets/GenerateArt';

function App() {
  const {isLoading, isWeb3, web3, accounts} = useWeb3();

  if (isLoading) {
    return <h1>Loading ..</h1>;
  }
  return (
    <div className="App">
      <GenerateLayout />
    </div>
  );
}

export default App;
