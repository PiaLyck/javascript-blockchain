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
    createGenesisBlock(){
        // Note: previousHash does not exist on the Genesis Block, so it can be set to anything, eg. 0
        return new Block(0, "23/01/2018", "Genesis block data", "0");
    }
}