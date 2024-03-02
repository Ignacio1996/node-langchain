const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { OpenAI } = require("langchain/llms/openai");
const { loadQAStuffChain } = require("langchain/chains");
const { Document } = require("langchain/document");

require("dotenv").config();

const queryingPineconeAndGPT = async (client, indexName, query) => {
  console.log("3-queryPineconeAndGPT.js 1 | querying pinecone...");
  try {
    console.log("3-queryPineconeAndGPT.js 8 | querying langchain");
    const index = client.Index(indexName);

    const queryEmbedding = await new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_KEY,
    }).embedQuery(query);

    let queryResponse = await index.query({
      topK: 10,
      vector: queryEmbedding,
      includeMetadata: true,
      includeValues: true,
    });

    console.log(
      "3-queryPineconeAndGPT.js 22 | found reponses",
      queryResponse.matches.length,
      "matches..."
    );

    if (queryResponse.matches.length) {
      const llm = new OpenAI({ openAIApiKey: process.env.OPENAI_KEY });
      const chain = loadQAStuffChain(llm);

      const concatenatedPageContent = queryResponse.matches
        .map((match) => match.metadata.pageContent)
        .join(" ");

      const result = await chain.call({
        input_documents: [
          new Document({ pageContent: concatenatedPageContent }),
        ],
        question: query,
      });

      console.log("3-queryPineconeAndGPT.js 45 | answer", result.text);
      return result.text;
    } else {
      console.log("3-queryPineconeAndGPT.js 47 | no matches");
      return "No matches";
    }
  } catch (error) {
    console.log("3-queryPineconeAndGPT.js 50 | error", error.message);
  }
};

module.exports = queryingPineconeAndGPT;
