const { ChatOpenAI } = require("@langchain/openai");
const { PromptTemplate } = require("@langchain/core/prompts");
require("dotenv").config();

console.log("node-langchain 4 | opena ai key", process.env.OPENAI_KEY);

const callModel = async () => {
  const model = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_KEY });
  const promptTemplate = PromptTemplate.fromTemplate(
    "Tell me a joke about {topic}"
  );

  const chain = promptTemplate.pipe(model);

  const result = await chain.invoke({ topic: "bears" });
  ``;
  console.log("node-langchain 16 | result", result.content);
  return result.content;
};

callModel();

// const readline = require("node:readline").createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// readline.question(`What's your name? `, (name) => {
//   console.log(`Hi ${name}!`);
//   readline.close();
// });

/*
  AIMessage {
    content: "Why don't bears wear shoes?\n\nBecause they have bear feet!",
  }
*/
