import { createServer, IncomingMessage, Server } from "node:http";

const server: Server = createServer((req: IncomingMessage, res) => {
  // console.log(req.url)
  // console.log(req.method)

  const url = req.url;
  const method = req.method;

  if (url === "/" && method === "GET") {
    // console.log("This is Root route")
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(JSON.stringify({message:"This is root rout"}));
  }else if(url?.startsWith('/products')){
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(JSON.stringify({message:"This is product rout"}));
  } else {
    res.writeHead(404, { "Content-type": "text/plain" });
    res.end("Route not found");
  }
});

server.listen(5000, () => {
  console.log("Server is running on the port 5000");
});
