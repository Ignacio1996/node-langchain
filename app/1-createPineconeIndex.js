const createPineConeIndex = async (client, indexName, vectorDimension) => {
  try {
    console.log("1-createPineconeIndex.js 4 | checking index name...");

    const existingIndexes = await client.listIndexes();
    console.log(
      "1-createPineconeIndex.js 5 | existing indexes",
      existingIndexes
    );

    if (
      !existingIndexes.indexes.find((index) => index.name === indexName)
    ) {
      const creatClient = await client.createIndex({
        name: indexName,
        dimension: vectorDimension,
        spec: {
          serverless: {
            cloud: "aws",
            region: "us-west-2",
          },
        },
      });
    } else {
      console.log(
        "1-createPineconeIndex.js 15 | ",
        indexName,
        "already exists"
      );
    }
  } catch (error) {
    console.log(
      "1-createPineconeIndex.js 4 | error creating index",
      error.message
    );
  }
};

module.exports = createPineConeIndex;
