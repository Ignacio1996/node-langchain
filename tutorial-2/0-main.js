const { PineconeClient, Pinecone } = require("@pinecone-database/pinecone");
const { DirectoryLoader } = require("langchain/document_loaders/fs/directory");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");

require("dotenv").config();

const createPineConeIndex = require("./1-createPineconeIndex");
const updatePinecone = require("./2-updatePinecone");
const queryingPineconeAndGPT = require("./3-queryPineconeAndGPT");

const loadDocs = async () => {
  console.log("0-main.js 10 | loading docs...");
  const loader = new DirectoryLoader("./data/recidivism", {
    ".md": (path) => new TextLoader(path),
    ".pdf": (path) => new PDFLoader(path),
  });
  const docs = await loader.load();
  console.log("0-main.js 14 | docs ready ✅", docs.length);
  return docs;
};

const initPineconeClient = async () => {
  console.log(
    "0-main.js 28 | initializing pinecone",
    process.env.PINECONE_API_KEY
  );
  const client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

  console.log("0-main.js 35 | client ready ✅", client);
  return client;
};

const query =
  "What are the differences between recidivism in males and females?";

const indexName = "node-langchain";

const vectorDimension = 1600;

const start = async () => {
  try {
    const docs = await loadDocs();
    const client = await initPineconeClient();

    await createPineConeIndex(client, indexName, vectorDimension);
    await updatePinecone(client, indexName, docs);
    await queryingPineconeAndGPT(client, indexName, query);
  } catch (error) {
    console.log("0-main.js 49 | error", error.message);
  }
};

start();
