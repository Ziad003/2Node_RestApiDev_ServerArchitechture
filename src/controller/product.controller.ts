import type { IncomingMessage, ServerResponse } from "node:http";
import { insartProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody } from "../utility/parseBody";

export const productController = async (
  req: IncomingMessage,
  res: ServerResponse,
) => {
  //
  //   console.log("Request", req);

  const url = req.url;
  const method = req.method;
  const urlParts = url?.split("/");
  const id =
    urlParts && urlParts[1] === "products" ? Number(urlParts[2]) : null;
  // console.log("This is the actual id:", id);
  if (url === "/products" && method === "GET") {
    // const products=[{
    //     id:1,
    //     name:"Product-1"
    // }]

    const products = readProduct();
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Products retrive successfully",
        data: products,
      }),
    );
  } else if (method === "GET" && id !== null) {
    const products = readProduct();
    const product = products.find((p: IProduct) => p.id === id);
    console.log(product);

    res.writeHead(200, { "Content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product retrive successfully",
        data: product,
      }),
    );
  }
  //
  else if (method === "POST" && url === "/products") {
    const body = await parseBody(req);
    // console.log("Body", body);
    const products = readProduct();
    const newProduct = {
      id: Date.now(),
      ...body,
    };
    // console.log(newProduct);
    products.push(newProduct)
    // console.log(products)
    insartProduct(products)
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product created successfully",
        data:newProduct
      }),
    );
  }
};
