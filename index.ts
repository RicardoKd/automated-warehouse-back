import fastify from "fastify";

const server = fastify();

server.get("/ping", async (req) => {
  return req;
});

server.get("/", async () => {
  return "This is the main page\n";
});

server.get("/", async () => {
  return "This is the main page\n";
});

server.get("/", async () => {
  return "This is the main page\n";
});

server.get("/manager", async () => {
  return "This should return a login page for the manager\n";
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
