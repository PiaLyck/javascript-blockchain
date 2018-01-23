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
        this.nonce = '0'; // See Proof-of-work comment
    }

    /*  Method for calculating the hash of the block, based on the block's properties.
        This will identify the block on the blockchain.    
    */
    calculateHash() {
        // Returns a SHA256 hash (casted to a string)
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data) + this.nonce).toString();
    }


    /* PROOF-OF-WORK MECHANISM
        To add security and avoid spamming the blockchain, the user has to prove that she/he put a lot of computing power into making a block.
        This process is also called 'mining'.
        Example: BitCoin requires the hash of a block to begin with a number of zeros, 
        so you have to run the hash function multiple times until you get lucky.
        This is also called 'the difficulty'. This way, there is a steady amount of blocks being created.

        Nonce: Nonces are used in proof-of-work systems to vary the input to a cryptographic hash function,
        so as to obtain a hash for a certain input that fulfills certain arbitrary conditions.
        Any change to the block data (such as the nonce) will make the block hash completely different.
        For more, see https://en.wikipedia.org/wiki/Cryptographic_nonce#Hashing
    */

    mineBlock(difficulty) {
        // Continue running until the block's hash starts with x amount of zeros (x = difficulty).
        while (this.hash.substring('0', difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log('Block mined: ' + this.hash + " Nonce: " + this.nonce);
    }

}

// Create class Blockchain
class Blockchain {
    /*  Initializing the blockchain.
        chain = Array of blocks, inialized to contain the Genesis block.
    */
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
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
        // newBlock.hash = newBlock.calculateHash();

        // Step 2 - Mine the block, using the constructors difficulty.
        newBlock.mineBlock(this.difficulty);

        // Step 3. Push block onto chain
        this.chain.push(newBlock);
    }

    /*  Blockchain is great because once a block is added, 
        it cannot be changed without invalidating the rest of the chain.
    */
    isChainValid() {
        // Check integrity by looping over the chain. Start at 1, because 0 is the Genesis block.
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // 1. Check if currentBlock's hash is still valid by calculating its hash again
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false; // The block's hash does not match its properties when recalculated.
            }

            // 2. Check if block points to a correct previous block. Is the previous hash property set correctly?
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false; // The block points to something else than the previous block.
            }
        }

        return true;
    }
}


/* TESTING TESTING */

// Create new blockchain
let sustainiaCoin = new Blockchain();

// Add 2 blocks to the blockchain
console.log('Mining block 1....');
sustainiaCoin.addBlock(new Block("1", "21/01/2018", {
    amount: 6
}));
console.log('Mining block 2....');
sustainiaCoin.addBlock(new Block("2", "22/01/2018", {
    amount: 2
}));

console.log(JSON.stringify(sustainiaCoin, null, 2));
console.log('Is blockchain valid? ' + sustainiaCoin.isChainValid());

/* 
// Valid
console.log('Is blockchain valid? ' + sustainiaCoin.isChainValid());

// Trying to tamper with the block by overwriting block no. 2's data
sustainiaCoin.chain[1].data = {
    amount: 666
};
// and then recalculating its hash
sustainiaCoin.chain[1].hash = sustainia.chain[1].calculateHash();

// Now the blockchain is invalid and prints 'false'
console.log('Is blockchain valid? ' + sustainiaCoin.isChainValid());

// Console.log out the result (stringify because the Blockchain is an object)
// console.log(JSON.stringify(sustainiaCoin, null, 2));

*/