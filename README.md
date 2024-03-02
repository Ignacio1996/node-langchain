
# Node.js Express Application with Pinecone Integration

This application is a Node.js Express server designed to interact with Pinecone, a vector database, using GPT for processing queries. It provides an endpoint to query files using Pinecone and GPT.

## Features

- **Express.js Framework:** Utilizes Express.js for creating the server and handling HTTP requests.
- **Body Parsing:** Uses `body-parser` middleware for parsing incoming request bodies in a middleware before handlers.
- **Pinecone Integration:** Includes functionality to initialize a Pinecone client and query Pinecone with GPT.

## Prerequisites

Before you begin, ensure you have installed the following:

- [Node.js](https://nodejs.org/en/) (version 12.x or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Installation

1. Clone the repository to your local machine.
2. Navigate to the project directory and install dependencies:

```sh
npm install
```

3. Ensure you have set up your Pinecone API key and project appropriately. The application expects these to be configured before running.

## Usage

To start the server, run the following command in your terminal:

```sh
npm start
```

or

```sh
node server.js
```

By default, the server will listen on port 8080. You can access the API endpoint at `http://localhost:8080/queryFiles`.

### API Endpoint

- **POST /queryFiles**

  - **Description:** Receives a query in the request body and processes it using Pinecone and GPT.
  - **Body:**

    ```json
    {
      "query": "your_query_here"
    }
    ```

  - **Response:** Returns the result of the query processing. If no query is provided, it returns an error message.

## Configuration

- **Port Configuration:** The server listens on the port specified by the `PORT` environment variable or defaults to 8080 if not specified.
- **Pinecone Configuration:** Ensure that you have configured your Pinecone client correctly in the `data.js` file. This includes setting up the Pinecone API key and project information.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.

## License

Specify your license here or indicate if the project is open-source.

---
**Note:** This README is a basic template and should be customized to fit your project's specific requirements.
