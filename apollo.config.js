module.exports = {
  client: {
    includes: ["./app/**/*.tsx"],
    service: {
      name: "codedown-server",
      localSchemaFile: __dirname + "/app/client/schema.graphql"
    }
  }
};
