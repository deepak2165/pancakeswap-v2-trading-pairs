import Web3 from 'web3';

// Connect to the Binance Smart Chain (BSC) node
const web3 = new Web3('https://bsc-dataseed.binance.org/');

// PancakeSwap Factory contract address on BSC
const pancakeSwapFactoryAddress = '0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73';

// Create an instance of the PancakeSwap Factory contract
const pancakeSwapFactory = new web3.eth.Contract([
  {
    "constant": true,
    "inputs": [{ "name": "index", "type": "uint256" }],
    "name": "allPairs",
    "outputs": [{ "name": "", "type": "address" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "allPairsLength",
    "outputs": [{ "name": "", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
], pancakeSwapFactoryAddress);


// Get the number of trading pairs using allPairsLength
pancakeSwapFactory.methods.allPairsLength().call()
  .then(async (pairCount) => {
    console.log(`Number of trading pairs: ${pairCount}`);

    // Fetch information for each trading pair
    for (let i = 0; i < pairCount; i++) {
      const pairAddress = await pancakeSwapFactory.methods.allPairs(i).call();

      const pancakeSwapPair = new web3.eth.Contract([
        { "constant": true, "inputs": [], "name": "getReserves", "outputs": [{ "name": "", "type": "uint112" }, { "name": "", "type": "uint112" }, { "name": "", "type": "uint32" }], "payable": false, "stateMutability": "view", "type": "function" },
        { "constant": true, "inputs": [], "name": "token0", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" },
        { "constant": true, "inputs": [], "name": "token1", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" },
      ], pairAddress);

      const reserves = await pancakeSwapPair.methods.getReserves().call();
      const token0Address = await pancakeSwapPair.methods.token0().call();
      const token1Address = await pancakeSwapPair.methods.token1().call();
      const token0Contract = new web3.eth.Contract([
        { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }
      ], token0Address);
      const token1Contract = new web3.eth.Contract([
        { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }
      ], token1Address);
      const token0Amount = reserves[0] / BigInt(1e18);
      const token1Amount = reserves[1] / BigInt(1e18);
      const token0Name = await token0Contract.methods.name().call();
      const token1Name = await token1Contract.methods.name().call();

      // You can do more queries or display information about each trading pair here
      console.log(`Trading Pair #${i + 1}: ${pairAddress}`);

      console.log(`Pair Address: ${pairAddress}`);
      console.log(`Token 0 Address: ${token0Address}`);
      console.log(`Token 1 Address: ${token1Address}`);
      console.log(`Token 0 Amount: ${token0Amount}`);
      console.log(`Token 1 Amount: ${token1Amount}`);
      console.log(`Token 0: ${token0Name}`);
      console.log(`Token 1: ${token1Name}`);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
  });
