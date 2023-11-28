import { json } from "@remix-run/node";

export default class shopifyProduct{
    admin: AdminApiContext;
    
    constructor(admin :Partial<AdminApiContext>) {
        this.admin = admin
    }

    async createRandamSnowBordProduct() {
        const color = ["Red", "Orange", "Yellow", "Green"][
            Math.floor(Math.random() * 4)
        ];
        const response = await this.admin.graphql(
            `#graphql
              mutation populateProduct($input: ProductInput!) {
                productCreate(input: $input) {
                  product {
                    id
                    title
                    handle
                    status
                    variants(first: 10) {
                      edges {
                        node {
                          id
                          price
                          barcode
                          createdAt
                        }
                      }
                    }
                  }
                }
              }`
          );
          const responseJson = await response.json();
        
          return json({
            product: responseJson.data.productCreate.product,
          });
    }
}