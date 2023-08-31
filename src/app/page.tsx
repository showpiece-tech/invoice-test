"use client";
import { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
} from "@chakra-ui/react";
import { PageWrapper } from "./components/pageWrapper";
import { GeneralBox } from "./components/generalBox";
import { Customer, Invoice } from "@/utils/data-helpers";
import { fetchCustomer } from "./services/customer";
import { fetchInvoices } from "./services/invoice";
import { DeleteIcon } from "@chakra-ui/icons";

export default function Home() {
  const [userId, setUserId] = useState("5ac51f7e-81b1-49c6-9c39-78b2d171abd6");
  const [customer, setCustomer] = useState<Customer | undefined>(undefined);
  const [invoices, setInvoices] = useState<Invoice[] | undefined>(undefined);
  const [invoicesTotal, setInvoicesTotal] = useState<number | undefined>(
    undefined
  );
  const [invoicesDiscountTotal, setinvoicesDiscountTotal] = useState<
    number | undefined
  >(undefined);
  const [invoicesPaidTotal, setinvoicesPaidTotal] = useState<
    number | undefined
  >(undefined);
  const [invoicesOwedTotal, setinvoicesOwedTotal] = useState<
    number | undefined
  >(undefined);

  useEffect(() => {
    (async () => {
      const customerData = await fetchCustomer(userId);
      setCustomer(customerData);
      const invoicesData = await fetchInvoices(userId);
      setInvoices(invoicesData?.data);
      setInvoicesTotal(invoicesData?.invoicesTotal);
      setinvoicesDiscountTotal(invoicesData?.invoicesDiscountTotal);
      setinvoicesPaidTotal(invoicesData?.invoicesPaidTotal);
      setinvoicesOwedTotal(invoicesData?.invoicesOwedTotal);
    })();
  }, [userId]);

  return (
    <>
      <PageWrapper>
        <GeneralBox>
          <Heading as="h2" size="lg">
            Invoices
          </Heading>
          <Text>
            Displaying invoices for <strong>{customer?.name}</strong>
          </Text>
        </GeneralBox>

        <GeneralBox>
          <TableContainer>
            <Table fontSize="sm">
              <Thead>
                <Tr>
                  <Th>Invoice #</Th>
                  <Th>Date Due</Th>
                  <Th>Date Sent</Th>
                  <Th>TOTAL(With Discount)</Th>
                  <Td></Td>
                </Tr>
              </Thead>
              <Tbody>
                {invoices &&
                  invoices.map(
                    ({
                      number,
                      id,
                      dateDue,
                      dateIssued,
                      invoiceTotal,
                      discount,
                      settled,
                    }) => {
                      console.log(dateIssued, invoiceTotal);
                      return (
                        <Tr key={id} color={!settled ? "red" : ""}>
                          <Td>{number}</Td>
                          <Td>{dateDue.toString()}</Td>
                          <Td>{dateIssued.toString()}</Td>
                          <Td color={discount != 0 ? "green" : ""}>
                            ${invoiceTotal?.toFixed(2) ?? 0}
                          </Td>
                          <Td>
                            {!settled ? (
                              <IconButton
                                colorScheme="red"
                                aria-label="Remove Invoice"
                                isRound={true}
                                onClick={() => {}}
                                icon={<DeleteIcon />}
                              />
                            ) : (
                              ""
                            )}
                          </Td>
                        </Tr>
                      );
                    }
                  )}
              </Tbody>
            </Table>
          </TableContainer>
        </GeneralBox>
        <GeneralBox>
          <Table fontSize="sm">
            <Tbody>
              <Tr>
                <Td>
                  <strong>Discount:</strong>
                </Td>
                <Td textAlign="right">
                  ${invoicesDiscountTotal?.toFixed(2) ?? 0}
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Invoice Total:</strong>
                </Td>
                <Td textAlign="right">${invoicesTotal?.toFixed(2) ?? 0}</Td>
              </Tr>
              <Tr>
                <Td>
                  <strong>Total Paid:</strong>
                </Td>
                <Td textAlign="right">${invoicesPaidTotal?.toFixed(2) ?? 0}</Td>
              </Tr>
              <Tr>
                <Td border="none">
                  <strong>Total Owed:</strong>
                </Td>
                <Td border="none" textAlign="right">
                  ${invoicesOwedTotal?.toFixed(2) ?? 0}
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </GeneralBox>
      </PageWrapper>
    </>
  );
}
