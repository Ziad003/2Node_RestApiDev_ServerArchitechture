import type { IncomingMessage, ServerResponse } from "node:http";
import { insartProduct, readProduct } from "../service/product.service";
import type { IProduct } from "../types/product.type";
import { parseBody } from "../utility/parseBody";
import { sendResponse } from "../utility/sendResponse";

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

    try {
      const products = readProduct();
    return sendResponse(res,200,true,"Products retrive successfully",products)
    } catch (error) {
    return sendResponse(res,500,false,"Something went wrong!",error)
    }
    
  } else if (method === "GET" && id !== null) {
    const products = readProduct();
    const product = products.find((p: IProduct) => p.id === id);
    // console.log(product);
    if (!product) {
      return sendResponse(res,404,false,"Product not found!")
    }

    try {
      return sendResponse(res,200,true,"Product retrive successfully",products)
    } catch (error) {
      return sendResponse(res,500,false,"Something went wrong!",error)
    }
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
    products.push(newProduct);
    // console.log(products)
    insartProduct(products);
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product created successfully",
        data: newProduct,
      }),
    );
  } else if (method === "PUT" && id !== null) {
    const body = await parseBody(req);
    const products = readProduct();

    const index = products.findIndex((p: IProduct) => p.id === id);
    // console.log(index);
    if (index < 0) {
      res.writeHead(404, { "Content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Product not found!",
          data: null,
        }),
      );
    }
    // console.log(products[index])
    products[index] = { id: products[index].id, ...body };
    insartProduct(products);
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product updated successfully",
        data: products[index],
      }),
    );
  } else if (method === "DELETE" && id !== null) {
    const products = readProduct();
    const index = products.findIndex((p: IProduct) => p.id === id);

    if (index < 0) {
      res.writeHead(404, { "Content-type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Product not found!",
          data: null,
        }),
      );
    }
    // const arr=[1,3,4,5,6]
    // arr.splice(2,1)
    // console.log(arr)

    products.splice(index, 1);
    // console.log(products);
    insartProduct(products);

    res.writeHead(200, { "Content-type": "application/json" });
    res.end(
      JSON.stringify({
        message: "Product deleted successfully",
        data: null,
      }),
    );
  }
};
