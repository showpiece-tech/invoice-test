"use client";
import { useEffect, useRef, useState } from "react";
import {
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
  Flex,
} from "@chakra-ui/react";
import { PageWrapper } from "./components/pageWrapper";
import { GeneralBox } from "./components/generalBox";
import { DeleteModal } from "./components/deleteModal";
import {
  Customer,
  Invoice,
  calculateTotals,
  formatDateValue,
} from "@/utils/data-helpers";
import { fetchCustomer } from "./services/customer";
import { deleteInvoice, fetchInvoices } from "./services/invoice";
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
  const [isOpen, setIsOpen] = useState(false);
  const [invoiceId, setinvoiceId] = useState<string | null>(null);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef(null);

  const handleDelete = async () => {
    if (invoiceId) {
      const deleteInvoiceRespose = await deleteInvoice(invoiceId);
      console.log(deleteInvoiceRespose);
      if (deleteInvoiceRespose === 200) {
        setInvoices(
          invoices?.filter((invoice) => invoice.id != invoiceId)
        );
      }
      onClose();
    }
  };

  useEffect(() => {
    (async () => {
      const customerData = await fetchCustomer(userId);
      setCustomer(customerData);
      const invoicesData = await fetchInvoices(userId);
      setInvoices(invoicesData);
    })();
  }, [userId]);

  useEffect(() => {
    if (invoices) {
      const {
        invoicesDiscountTotal,
        invoicesOwedTotal,
        invoicesPaidTotal,
        invoicesTotal,
      } = calculateTotals(invoices);
      setInvoicesTotal(invoicesTotal);
      setinvoicesDiscountTotal(invoicesDiscountTotal);
      setinvoicesPaidTotal(invoicesPaidTotal);
      setinvoicesOwedTotal(invoicesOwedTotal);
    }
  }, [invoices]);

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
                  <Th position="sticky" left={0} zIndex={1} background="white">
                    Invoice #
                  </Th>
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
                      return (
                        <Tr key={id} color={!settled ? "red" : ""}>
                          <Td
                            position="sticky"
                            left={0}
                            zIndex={1}
                            background="white"
                          >
                            {number}
                          </Td>
                          <Td>{formatDateValue(dateDue)}</Td>
                          <Td>{formatDateValue(dateIssued)}</Td>
                          <Td color={discount && discount > 0 ? "green" : ""}>
                            ${invoiceTotal?.toFixed(2) ?? 0}
                          </Td>
                          <Td>
                            {!settled ? (
                              <IconButton
                                colorScheme="red"
                                aria-label="Remove Invoice"
                                isRound={true}
                                onClick={() => {
                                  setinvoiceId(id);
                                  setIsOpen(true);
                                }}
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

        <DeleteModal
          isOpen={isOpen}
          onClose={onClose}
          onDelete={handleDelete}
          leastDestructiveRef={cancelRef}
        />

        <Flex justifyContent={"flex-end"}>
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
                  <Td textAlign="right">
                    ${invoicesPaidTotal?.toFixed(2) ?? 0}
                  </Td>
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
        </Flex>
      </PageWrapper>
    </>
  );
}
