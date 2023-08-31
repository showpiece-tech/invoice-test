import fetch from "node-fetch";
import { createMocks } from 'node-mocks-http';
import { GET } from './route'
describe("Find Customer Route", () => {
  describe("GET customer", () => {
    const customerId = '5ac51f7e-81b1-49c6-9c39-78b2d171abd6';
    const { req } = createMocks({
      method: 'GET',
    });

    it("should return a single customer by id", async () => {
      const customerRequest = await GET(req, {
        params: { id: customerId }
      });
      const customer = await customerRequest.json();
      expect(customerRequest.status).toEqual(200);
      expect(customer.data.id).toEqual(customerId);
    });

    it("should fail if it cant find a Customer", async () => {
      const customerRequest = await GET(req, {
        params: { id: 'not-a-valid-id' }
      });
      const customer = await customerRequest.json();
      expect(customerRequest.status).toEqual(404);
      expect(customer.data).toEqual(undefined);
    });
  })
});