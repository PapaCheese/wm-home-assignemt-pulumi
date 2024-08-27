import * as pulumi from "@pulumi/pulumi";
import axios from "axios";

class ProductProvider implements pulumi.dynamic.ResourceProvider {
  async create(inputs: any): Promise<pulumi.dynamic.CreateResult> {
    try {
      const response = await axios.post(
        "http://localhost:8080/product",
        inputs
      );
      return { id: response.data, outs: inputs };
    } catch (error: any) {
      console.error(
        "Error creating product:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  async delete(id: pulumi.ID, props: any): Promise<void> {
    try {
      await axios.delete(`http://localhost:8080/product/${id}`);
      console.log(`Product with ID ${id} has been deleted.`);
    } catch (error: any) {
      console.error(
        "Error deleting product:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

class Product extends pulumi.dynamic.Resource {
  constructor(name: string, args: any, opts?: pulumi.CustomResourceOptions) {
    super(new ProductProvider(), name, args, opts);
  }
}

// TESTING
// Create a new product
const exampleProduct = new Product("product_1", {
  product: {
    name: "Product from pulumi2",
    price: "49.98",
    brand: "Test Brand",
    category: "shirt",
  },
});

// Export the product ID to verify creation
export const productId = exampleProduct.id;
