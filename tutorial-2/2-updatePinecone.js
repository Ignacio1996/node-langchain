const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

require("dotenv").config();

const updatePinecone = async (client, indexName, docs) => {
  try {
    console.log("2-updatePinecone.js 3 | updating pinecone with docs...");
    const index = await client.Index(indexName);

    console.log("2-updatePinecone.js 8 | index retrieved", index);

    for (const doc of docs) {
      console.log(
        "2-updatePinecone.js 12 | processing doc ",
        doc.metadata.source
      );

      const txtPath = doc.metadata.source;
      const text = doc.pageContent;

      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
      });

      console.log("2-updatePinecone.js 23 | splitting text into chunks...");

      const chunks = await textSplitter.createDocuments([text]);

      console.log("2-updatePinecone.js 27 | text split into ", chunks.length);
      console.log("2-updatePinecone.js 28 | calling openai embeddings...");

      const embeddingsArray = await new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_KEY,
      }).embedDocuments(
        chunks.map((chunk) => chunk.pageContent.replace(/\n/g, ""))
      );

      console.log("2-updatePinecone.js 38 | finished embedding documents");
      console.log(
        "2-updatePinecone.js 39 | creating ",
        chunks.length,
        "vectors array with id, values and metadata"
      );
      const batchSize = 100;
      let batch = [];
      for (let idx = 0; idx < chunks.length; idx++) {
        const chunk = chunks[idx];
        const vector = {
          id: `${txtPath}_${idx}`,
          values: embeddingsArray[idx],
          metadata: {
            ...chunk.metadata,
            loc: JSON.stringify(chunk.metadata.loc),
            pageContent: chunk.pageContent,
            txtPath: txtPath,
          },
        };

        batch.push(vector);

        if (batch.length === batchSize || idx === chunks.length - 1) {
          await index.upsert(batch);
          batch = [];
        }
      }
      console.log(
        "2-updatePinecone.js 70 | Pinecone Index updated with ",
        chunks.length,
        "vectors"
      );
    }
  } catch (error) {
    console.log(
      "2-updatePinecone.js 4 | error updating pinecone",
      error.message
    );
  }
};

const upsertDocs = async (index, batch) => {
  try {
    const upserting = await index.upsert(batch);
  } catch (error) {
    console.log("2-updatePinecone.js 84 | error upserting", error.message);
  }
};

module.exports = updatePinecone;
