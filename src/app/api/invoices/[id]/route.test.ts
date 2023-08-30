import { createMocks } from "node-mocks-http";
import { GET } from "./route";

describe("Invoices Route", () => {
  describe("GET invoices", () => {
    const customerId = "5ac51f7e-81b1-49c6-9c39-78b2d171abd6";
    const { req } = createMocks({
      method: "GET",
    });

    test("should return all the customer's invoices", async () => {
      const customerRequest = await GET(req, {
        params: { id: customerId },
      });

      const invoices = await customerRequest.json();

      expect(customerRequest.status).toEqual(200);
      expect(invoices.data.length).toBeGreaterThan(0);
      expect(invoices.data[0].recipient).toEqual(customerId);
    });

    test("should fail if no invoice found for customer", async () => {
      const customerRequest = await GET(req, {
        params: { id: "not-a-valid-id" },
      });
      const invoices = await customerRequest.json();
      
      expect(customerRequest.status).toEqual(404);
      expect(invoices.data.length).toBe(0);
    });
  });
});
