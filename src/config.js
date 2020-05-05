const env = window.location.hostname === "localhost" ? "development" : "production";

const environments = {
  "development": {
    "web": "http://localhost:3000",
    "server": "http://localhost:8000"
  },
  "production": {
    "web": "http://your.address.here",
    "server": "http://your.server.address.here"
  }
};

module.exports = environments[env];