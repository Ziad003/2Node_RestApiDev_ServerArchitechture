import type { IncomingMessage, ServerResponse } from "node:http";
import { productController } from "../controller/product.controller";

export const routeHandler=(req:IncomingMessage,res:ServerResponse)=>{
  // console.log(req.url)
  // console.log(req.method)

  const url = req.url;
  const method = req.method;

  if (url === "/" && method === "GET") {
    // console.log("This is Root route")
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(JSON.stringify({message:"This is root rout"}));
  }else if(url?.startsWith('/products')){
    productController(req,res)
  } else {
    res.writeHead(404, { "Content-type": "text/plain" });
    res.end("Route not found");
  }
}