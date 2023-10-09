import { createMocks } from 'node-mocks-http';
import { GET } from './route'
describe("Invoices Route", () => {
  describe("GET invoices", () => {
    const { req } = createMocks({
      method: 'GET',
    });

    it("should return invoices", async () => {
      const invoiceRequest = await GET(req );
      const invoice = await invoiceRequest.json();
      expect(invoiceRequest.status).toEqual(200);
    });
  })
});
