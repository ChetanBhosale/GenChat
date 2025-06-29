import { Pinecone } from '@pinecone-database/pinecone'
import dotenv from 'dotenv';
dotenv.config({path: '../../.env'});

const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });

// Sample dataset with diverse topics similar to the quickstart
const records = [
    {
      url: "https://v3cn.vineet.pro/",
      pageTitle: "V3CN - Components like never before",
      timestamp: "2025-06-28T14:13:11.971Z",
      chunkType: "heading_content",
      content: "Make your website stand outBeautiful & Unique UIs\nA collection of unique components that make your website stand out. Crafted for speed, flexibility, and seamless design.\n",
      _id: "00197b6e2-c6c8-7000-865b-e72a0d8ee0a4",
    }, {
      url: "https://v3cn.vineet.pro/",
      pageTitle: "V3CN - Components like never before",
      timestamp: "2025-06-28T14:13:11.971Z",
      chunkType: "code",
      content: "Beautiful components, ready to use.\n",
      _id: "20197b6e2-c6c9-7000-bd56-ae2d257b5392",
    }, {
      url: "https://v3cn.vineet.pro/",
      pageTitle: "V3CN - Components like never before",
      timestamp: "2025-06-28T14:13:11.971Z",
      chunkType: "code",
      content: "Build Stunning Interfaces with Ease.\n",
      _id: "40197b6e2-c6c9-7001-aee8-3fd234332b58",
    }, {
      url: "https://v3cn.vineet.pro/docs/introduction",
      pageTitle: "Introduction - V3CN",
      timestamp: "2025-06-28T14:13:13.277Z",
      chunkType: "content",
      content: "A collection of unique components that make your website stand out.\n",
      _id: "00197b6e2-c6c9-7002-9ce4-b9622d7d0bf1",
    }, {
      url: "https://v3cn.vineet.pro/docs/installation",
      pageTitle: "Installation - V3CN",
      timestamp: "2025-06-28T14:13:14.578Z",
      chunkType: "content",
      content: "Install all necessary modules before using our utility.\n",
      _id: "00197b6e2-c6c9-7003-a389-8c1bbb46ec7d",
    }, {
      url: "https://v3cn.vineet.pro/docs/installation",
      pageTitle: "Installation - V3CN",
      timestamp: "2025-06-28T14:13:14.578Z",
      chunkType: "content",
      content: "Integrate all our custom components with ease.\n",
      _id: "20197b6e2-c6c9-7004-a82c-9c268eee43d2",
    }, 
  ]


const oldRecors = [
      { "_id": "rec10", "chunk_text": "Newton's laws describe the motion of objects.", "category": "physics" },
  { "_id": "rec11", "chunk_text": "The human brain has approximately 86 billion neurons.", "category": "biology" },
  { "_id": "rec12", "chunk_text": "The Amazon Rainforest is one of the most biodiverse places on Earth.", "category": "geography" },
  { "_id": "rec13", "chunk_text": "Black holes have gravitational fields so strong that not even light can escape.", "category": "astronomy" },
  { "_id": "rec14", "chunk_text": "The periodic table organizes elements based on their atomic number.", "category": "chemistry" },
  { "_id": "rec15", "chunk_text": "Leonardo da Vinci painted the Mona Lisa.", "category": "art" },
  { "_id": "rec16", "chunk_text": "The internet revolutionized communication and information sharing.", "category": "technology" },
  { "_id": "rec17", "chunk_text": "The Pyramids of Giza are among the Seven Wonders of the Ancient World.", "category": "history" },
  { "_id": "rec18", "chunk_text": "Dogs have an incredible sense of smell, much stronger than humans.", "category": "biology" },
  { "_id": "rec19", "chunk_text": "The Pacific Ocean is the largest and deepest ocean on Earth.", "category": "geography" },
  { "_id": "rec20", "chunk_text": "Chess is a strategic game that originated in India.", "category": "games" },
  { "_id": "rec21", "chunk_text": "The Statue of Liberty was a gift from France to the United States.", "category": "history" },
  { "_id": "rec22", "chunk_text": "Coffee contains caffeine, a natural stimulant.", "category": "food science" },
  { "_id": "rec23", "chunk_text": "Thomas Edison invented the practical electric light bulb.", "category": "inventions" },
  { "_id": "rec24", "chunk_text": "The moon influences ocean tides due to gravitational pull.", "category": "astronomy" },
  { "_id": "rec25", "chunk_text": "DNA carries genetic information for all living organisms.", "category": "biology" },
  { "_id": "rec26", "chunk_text": "Rome was once the center of a vast empire.", "category": "history" },
  { "_id": "rec27", "chunk_text": "The Wright brothers pioneered human flight in 1903.", "category": "inventions" },
  { "_id": "rec28", "chunk_text": "Bananas are a good source of potassium.", "category": "nutrition" },
  { "_id": "rec29", "chunk_text": "The stock market fluctuates based on supply and demand.", "category": "economics" },
  { "_id": "rec30", "chunk_text": "A compass needle points toward the magnetic north pole.", "category": "navigation" },

]


async function runPineconeExample() {
  const indexName = 'quickstart-example';
  
  try {
    // const indexesData = await pc.listIndexes()
    // for(let i of indexesData.indexes || []){
    //     console.log({i})
    //     await pc.deleteIndex(i.name)
    //     console.log('Index deleted successfully!',i.name)
    // }

    // Step 1: Create a dense index with integrated embedding
    console.log('Creating index...');
    await pc.createIndexForModel({
      name: indexName,
      cloud: 'aws',
      region: 'us-east-1',
      embed: {
        model: 'llama-text-embed-v2',
        fieldMap: { text: 'content' },
      },
      waitUntilReady: true,
    });
    console.log('Index created successfully!');

    // Step 2: Target the index with a namespace
    const index = await pc.index(indexName).namespace("example-namespace");
    console.log({index},'index is calleddd')
    // Step 3: Upsert the sample dataset
    console.log('Upserting records...');
    // await index.deleteAll()
    await index.upsertRecords(records);
    console.log('Records upserted successfully!');

    // Step 4: Wait for vectors to be indexed
    console.log('Waiting for vectors to be indexed...');
    // await new Promise(resolve => setTimeout(resolve, 10000));

    // Step 5: Check index stats
    const stats = await index.describeIndexStats();
    console.log('Index stats:', stats);

    // Step 6: Perform semantic search
    const query = 'Famous historical structures and monuments';
    console.log(`\nSearching for: "${query}"`);
    
    const results : any = await index.searchRecords({
      query: {
        topK: 10,
        inputs: { text: query },
      },
    });

    for(let i of results.result.hits){
        console.log({i})
    }

    // console.log('\n--- Initial Search Results ---');
    // results.result.hits.forEach((hit, index) => {
    //   console.log(`${index + 1}. id: ${hit.id}, score: ${hit.score.toFixed(2)}, category: ${hit.fields.category}, text: ${hit.fields.chunk_text}`);
    // });

    // Step 7: Search with reranking for better accuracy
    console.log('\n--- Reranked Search Results ---');
    const rerankedResults = await index.searchRecords({
      query: {
        topK: 10,
        inputs: { text: query },
      },
      rerank: {
        model: 'bge-reranker-v2-m3',
        topN: 10,
        rankFields: ['chunk_text'],
      },
    });

    rerankedResults.result.hits.forEach((hit, index) => {
    //   console.log(`${index + 1}. id: ${hit.id}, score: ${hit.score.toFixed(2)}, category: ${hit.fields.category}, text: ${hit.fields.chunk_text}`);
    console.log({hit},'hit is calleddd')
});

    // // Step 8: Example with metadata filtering
    // console.log('\n--- Search with Metadata Filter (History category only) ---');
    // const filteredResults = await index.searchRecords({
    //   query: {
    //     topK: 5,
    //     inputs: { text: query },
    //     filter: { category: { $eq: 'history' } },
    //   },
    // });

    // filteredResults.result.hits.forEach((hit, index) => {
    //   console.log(`${index + 1}. id: ${hit.id}, score: ${hit.score.toFixed(2)}, category: ${hit.fields.category}, text: ${hit.fields.chunk_text}`);
    // });

    // // Step 9: Clean up - delete the index
    // console.log('\nCleaning up...');
    // await pc.deleteIndex(indexName);
    // console.log('Index deleted successfully!');

  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the example
runPineconeExample();