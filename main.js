// Import SHA256 from crypto-js library
const SHA256 = require('crypto-js/sha256');

// Create class Block that defines that a block on our blockchain will look like.
class Block {
    /*  The constructor receives the properties of the block, ie. index, timestamp, some data and previous hash.
        index = optional. Tells us where the block is located on the chain.
        timestamp = when was the block created.
        data = Object. Any sort of data that you want to associate with this block, eg. transaction details, if used for a cryptocurrency.
        previous hash = String. Contains the hash of the block before this one. Insures the integrity of the blockchain. Set to empty from default.
        hash = String. Returned from calculateHash() function.
    */
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash(); // contains the hash of the block. 
    }

    /*  Method for calculating the hash of the block, based on the block's properties.
        This will identify the block on the blockchain.    
    */
    calculateHash() {
        // Returns a SHA256 hash (casted to a string)
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data)).toString();
    }
}

// Create class Blockchain
class Blockchain {
    /*  Initializing the blockchain.
        chain = Array of blocks, inialized to contain the Genesis block.
    */
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    //  The first block on a blockchain is called a 'Genesis Block' and should be added manually
    createGenesisBlock() {
        // Note: previousHash does not exist on the Genesis Block, so it can be set to anything, eg. 0
        return new Block(0, "23/01/2018", "Genesis block data", "0");
    }

    // Returns the latest block on the chain
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Adding a new block to the chain. 
    addBlock(newBlock) {
        // Step 1. Set the new block's previousHash to the hash of the latest on the chain.
        newBlock.previousHash = this.getLatestBlock().hash;

        // Step 2. Recalculate the hash. Must be done every time a block's properties changes, eg. when setting the previousHash in Step 1.
        newBlock.hash = newBlock.calculateHash();

        // Step 3. Push block onto chain
        this.chain.push(newBlock);
    }
}

/* TESTING TESTING */

// Create new blockchain
let sustainiaCoin = new Blockchain();

// Add 2 blocks to the blockchain
sustainiaCoin.addBlock(new Block("1", "21/01/2018", {
    amount: 6
}));
sustainiaCoin.addBlock(new Block("2", "22/01/2018", {
    amount: 2
}));

// Console.log out the result (stringify because the Blockchain is an object)
console.log(JSON.stringify(sustainiaCoin, null, 2));