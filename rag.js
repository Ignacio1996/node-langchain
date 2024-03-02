const { HNSWLib } = require("@langchain/community/vectorstores/hnswlib");
const { Chroma } = require("@langchain/community/vectorstores/chroma");

const { ChatOpenAI, OpenAIEmbeddings } = require("@langchain/openai");
require("dotenv").config();
const { formatDocumentsAsString } = require("langchain/util/document");
const { PromptTemplate } = require("@langchain/core/prompts");
const {
  RunnableSequence,
  RunnablePassthrough,
} = require("@langchain/core/runnables");
const { StringOutputParser } = require("@langchain/core/output_parsers");

const { TextLoader } = require("langchain/document_loaders/fs/text");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { Document } = require("@langchain/core/documents");

const createVectorStoreWithDocs = async (docs) => {
  // Create vector store and index the docs
  try {
    const vectorStore = await Chroma.fromDocuments(
      docs,
      new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_KEY }),
      {
        collectionName: "alice",
        url: "http://localhost:8000", // Optional, will default to this value
        collectionMetadata: {
          "hnsw:space": "cosine",
        }, // Optional, can be used to specify the distance method of the embedding space https://docs.trychroma.com/usage-guide#changing-the-distance-function
      }
    );
    console.log("rag.js 27 | created vector store!", vectorStore);

    return vectorStore;
  } catch (error) {
    console.log("rag.js 35 | error here", error.message);
  }
};

const similaritySearch = async (vectorStore, query, resultsNum) => {
  try {
    const response = await vectorStore.similaritySearch(query, resultsNum);
    return response;
  } catch (error) {
    console.log("rag.js 34 | error with similarity search");
  }
};

const loadText = async () => {
  try {
    const loader = new TextLoader("data/books/alice_in_wonderland.md");
    const docs = await loader.load();
    return docs;
  } catch (error) {
    console.log("rag.js 21 | error", error.message);
  }
};

const rag = async () => {
  try {
    const model = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_KEY });

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 1,
    });

    // load docs
    const docs = await loadText();

    const db = await createVectorStoreWithDocs(docs);

    const questionSearch = await similaritySearch(
      db,
      "What are the main causes of recidivism?",
      10
    );

    console.log("rag.js 70 | questionSearch", questionSearch);

    // const output = await splitter.splitDocuments([
    //   new Document({ pageContent: docs[0].pageContent }),
    // ]);

    console.log("rag.js 38 | output", output);
  } catch (error) {
    console.log("rag.js 84 | error", error.message);
  }

  // console.log("rag.js 29 | docs", docs);

  // break into chunks

  // return chunks

  // send to vector store

  // const vectorStore = await HNSWLib.fromTexts(
  //   docs.map((page) => page.pageContent),
  //   [{ id: 1 }],
  //   new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_KEY })
  // );
  // const retriever = vectorStore.asRetriever();

  //   const prompt =
  //     PromptTemplate.fromTemplate(`Answer the question based only on the following context:
  // {context}

  // Question: {question}`);

  //   const chain = RunnableSequence.from([
  //     {
  //       context: retriever.pipe(formatDocumentsAsString),
  //       question: new RunnablePassthrough(),
  //     },
  //     prompt,
  //     model,
  //     new StringOutputParser(),
  //   ]);

  //   const result = await chain.invoke("Where did Alice meet the mad hatter?");

  //   console.log(result);
};

rag();

/*
  "The powerhouse of the cell is the mitochondria."
*/
