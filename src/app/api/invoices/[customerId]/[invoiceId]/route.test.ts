import { createMocks } from "node-mocks-http";
import { DELETE } from "./route";

describe("DELETE Invoice Route", () => {
  describe("DELETE Invoice", () => {
    const customerId = "5ac51f7e-81b1-49c6-9c39-78b2d171abd6";
    const invoiceId = "3181ec6d-bdf5-44b0-84fd-d9d5d2c61dd0";

    const { req } = createMocks({
      method: "DELETE",
    });

    it("It should delete the invoice", async () => {
      const invoiceRequest = await DELETE(req, {
        params: { customerId: customerId, invoiceId: invoiceId },
      });

      // import
      const invoiceDataCopy = require("../../../../../data/invoices-copy.json");
      // Invoice data copy should not contain the invoice
      const invoice = invoiceDataCopy.invoices.find(
        ({ id }: { id: string }) => id === invoiceId
      );
      expect(invoice).toEqual(undefined);
      expect(invoiceRequest.status).toEqual(200);
    });

    it("It should fail if it cant find a invoice", async () => {
      const invoiceRequest = await DELETE(req, {
        params: { customerId: customerId, invoiceId: "not-a-valid-id" },
      });
      expect(invoiceRequest.status).toEqual(404);
    });

    it("It should fail if invoice is settled", async () => {
      const invoiceIdWithSettledStatus = "834a9c6c-9c71-49d7-a8a5-821ea43b2800";
      const invoiceRequest = await DELETE(req, {
        params: {
          customerId: customerId,
          invoiceId: invoiceIdWithSettledStatus,
        },
      });
      expect(invoiceRequest.status).toEqual(400);
    });
  });
});
