import { createMocks } from 'node-mocks-http';
import { GET } from './route'
describe("invoice Route", () => {
  describe("GET invoice", () => {
    const invoiceId = '1ad90a91-4cc9-437f-a40f-45b1716e09f5';
    const { req } = createMocks({
      method: 'GET',
    });

    it("should return a single invoice by id", async () => {
      const invoiceRequest = await GET(req, {
        params: { id: invoiceId }
      });
      const invoice = await invoiceRequest.json();
      expect(invoiceRequest.status).toEqual(200);
      expect(invoice.data.id).toEqual(invoiceId);
    });

    it("should fail if it cant find a invoice", async () => {
      const invoiceRequest = await GET(req, {
        params: { id: 'not-a-valid-id' }
      });
      const invoice = await invoiceRequest.json();
      expect(invoiceRequest.status).toEqual(404);
      expect(invoice.data).toEqual(undefined);
    });
  })
});
