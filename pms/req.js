const http = require("http");
const fs = require("fs");
const url = require("url");

const server = http.createServer((req, res) => {
    //   console.log(req.method);
    //   console.log(req.url);
    //   res.write("Here is your response");
    //   res.end();

    // if(req.method === "GET" ){
    //     res.write("GET request is coming");
    // }

    let parsedURL = url.parse(req.url, true);
    let products = JSON.parse(
        fs.readFileSync("./products.json", { encoding: "utf-8" })
    );

    res.writeHead(200, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "DELETE,PUT,PATCH",
        "Access-Control-Allow-Headers": "*",
    });

    if (req.method === "OPTIONS") {
        res.end();
    } 
    else if (req.method === "GET" && parsedURL.pathname === "/products") {
        let id = parsedURL.query.id;
        // console.log(id);
        if (id === undefined) {
            res.write(JSON.stringify(products));
            res.end();
        } else {
            let product = products.find((product, index) => {
                return Number(product.id) === Number(id);
            });
            if (product !== undefined) {
                res.write(JSON.stringify(product));
                res.end();
            } else {
                res.write(JSON.stringify({ message: "Invalid Product ID", success : false }));
                res.end();
            }
        }
       
    } 
    else if (req.method === "DELETE" && parsedURL.pathname === "/products") {
        let id = parsedURL.query.id;
        // console.log(id);
        if (id !== undefined) {
            let indexToDelete = products.findIndex((product, index) => {
                return Number(product.id) === Number(id);
            });
            if (indexToDelete !== -1) {
                products.splice(indexToDelete, 1);
                fs.writeFile("./products.json", JSON.stringify(products), (err) => {
                    if (err === null) {
                        res.write(JSON.stringify({ message: "product deleted",success : true }));
                        res.end();
                    } else {
                        res.write(JSON.stringify({ message: "some problem",success : false }));
                        res.end();
                    }
                });
            } else {
                res.write(JSON.stringify({ message: "invalid product id",success : false }));
                res.end();
            }
        } else {
            res.write(JSON.stringify({ message: "please enter the valid URL" ,success : false }));
            res.end();
        }
    } 
    else if (req.method === "POST" && parsedURL.pathname === "/products") {
        // let id = parsedURL.query.id;
        let data = "";
        req.on("data", (chunck) => {
            data += chunck;
        });
        req.on("end", () => {
            let dataOBJ = JSON.parse(data);
            products.push(dataOBJ);
            fs.writeFile("./products.json", JSON.stringify(products), (err) => {
                // console.log(err);
                if (err === null) {
                    res.write(JSON.stringify({ message: "product added",success : true }));
                    res.end();
                } else {
                    res.write(JSON.stringify({ message: "some problm in adding",success : false }));
                    res.end();
                }
            });
        });
    } else if (req.method === "PUT" && parsedURL.pathname === "/products") {
        let id = parsedURL.query.id;
        // console.log(id);
        if (id !== undefined) {
            let data = "";
            req.on("data", (chunck) => {
                data += chunck;
            });
            req.on("end", () => {
                let indexToupdate = products.findIndex((product, index) => {
                    return Number(product.id) === Number(id);
                });
                if (indexToupdate !== -1) {
                    products[indexToupdate] = JSON.parse(data);
                    fs.writeFile("./products.json", JSON.stringify(products), (err) => {
                        if (err === null) {
                            res.write(JSON.stringify({ message: "product updated",success : true }));
                            res.end();
                        } else {
                            res.write(
                                JSON.stringify({ message: "some problem in updating",success : false })
                            );
                            res.end();
                        }
                    });
                } else {
                    res.write(JSON.stringify({ message: "invalide product found",success : false }));
                    res.end();
                }
            });
        } else {
            res.write(JSON.stringify({ message: "invalide id",success : false }));
            res.end();
        }
    } else {
        res.write(JSON.stringify({ message: "404 NOT FOUND",success : false }));
        res.end();
    }
});
server.listen(8000, () => {
    console.log("server is up and running");
});
