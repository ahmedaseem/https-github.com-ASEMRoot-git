// search.service.js
const {
    indexUser
} = require("../../../../search/indexer/index.service");

const engine =
require("./engine/memory.adapter");



exports.globalSearch =
async(query)=>{


const results =
await engine.search(
query.q
);



return {

results,

total:
results.length

};


};

