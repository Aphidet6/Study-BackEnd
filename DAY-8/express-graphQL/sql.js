const mysql = require("mysql2");
const express = require("express");
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const graphql = require("graphql");

// เชื่อมต่อกับฐานข้อมูล MySQL
const db = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "mynewpassword",
  database: "ecommerce_db",
});

// สร้าง GraphQL Type สำหรับ Products
const ProductType = new graphql.GraphQLObjectType({
  name: "Product",
  fields: {
    id: { type: graphql.GraphQLInt },
    name: { type: graphql.GraphQLString },
    price: { type: graphql.GraphQLFloat },
    discount: { type: graphql.GraphQLFloat },
    review_count: { type: graphql.GraphQLInt },
    image_url: { type: graphql.GraphQLString },
  },
});

// สร้าง Query สำหรับ Products
const QueryRoot = new graphql.GraphQLObjectType({
  name: "Query",
  fields: () => ({
    hello: {
      type: graphql.GraphQLString,
      resolve: () => "Hello world!",
    },
    products: {
      type: new graphql.GraphQLList(ProductType),
      resolve: async () => {
        // ดึงข้อมูลจากฐานข้อมูล MySQL
        return new Promise((resolve, reject) => {
          db.query("SELECT * FROM products", (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        });
      },
    },
  }),
});

// สร้าง Schema
const schema = new graphql.GraphQLSchema({ query: QueryRoot });

// สร้างเซิร์ฟเวอร์ Express
const app = express();
app.use(
  "/api",
  graphqlHTTP({
    schema: schema,
    graphiql: true,
  })
);

app.listen(4000, () => {
  console.log("Server is running on http://localhost:4000/api");
});
