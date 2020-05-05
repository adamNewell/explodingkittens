This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
## Install
Clone the project and run

`npm install`

## Available Scripts

In the project directory, you can run:

### Build the docker container on your local system

`docker build -t kittens:latest -f docker/Dockerfile .`


### Run the container

`docker run -p 8080:3000 -p 8000:8000 -d kittens`

### Run the client and the server
`node -r esm src/server.js & npm run start`