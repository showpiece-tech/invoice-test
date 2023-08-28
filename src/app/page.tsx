"use client";
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  IconButton,
} from "@chakra-ui/react";

import { DeleteIcon } from "@chakra-ui/icons";

import { PageWrapper } from "./components/pageWrapper";
import { GeneralBox } from "./components/generalBox";
import useInvoicesAndCustomerApi from "@/hooks/useInvoicesAndCustomerApi";
import { formatDateDDMMYY } from "@/utils/date-helpers";
import {
  getSumOfAllDiscounts,
  getInvoiceAmount,
  getSumOfIvoices,
} from "@/utils/invoice-helpers";
import { Invoice } from "@/utils/data-helpers";

import { useState } from "react";

const ConfirmationDeletionModal = ({
  isOpen,
  onClose,
  confirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  confirm: () => void;
}) => {
  return (
    <Modal blockScrollOnMount={true} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Invoice</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb="1rem">
            Are you sure? You can't undo this action afterwards.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" mr={3} onClick={confirm}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default function Home() {
  const { invoices, customer, isLoading, isError, deleteInvoice } =
    useInvoicesAndCustomerApi();

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const handleDeleteInvoice = () => {
    if (selectedInvoice) {
      deleteInvoice(selectedInvoice.id);
      setModalOpen(false);
    }
  };

  return (
    <>
      {invoices && customer && (
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
              <Table fontSize="sm" variant="striped" colorScheme="gray">
                <Thead>
                  <Tr>
                    <Th
                      position="sticky"
                      top={0}
                      left={0}
                      zIndex={50}
                      bgColor="white"
                    >
                      Invoice #
                    </Th>
                    <Th>Date Due</Th>
                    <Th>Date Sent</Th>
                    <Th>Amount</Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {invoices &&
                    invoices.map((invoice: Invoice, index: number) => (
                      <Tr
                        key={invoice.id}
                        color={!invoice.settled ? "red" : undefined}
                      >
                        <Td
                          position="sticky"
                          top={0}
                          left={0}
                          zIndex={50}
                          bgColor={index % 2 != 0 ? "white" : undefined}
                        >
                          {invoice.number}
                        </Td>
                        <Td>{formatDateDDMMYY(invoice.dateDue as string)}</Td>
                        <Td>
                          {formatDateDDMMYY(invoice.dateIssued as string)}
                        </Td>
                        <Td color={invoice.discount ? "green" : undefined}>
                          ${Number(getInvoiceAmount(invoice)).toFixed(2)}
                        </Td>
                        <Td>
                          {!invoice.settled && (
                            <IconButton
                              aria-label="Delete Invoice"
                              icon={<DeleteIcon color="red" />}
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setModalOpen(true);
                              }}
                              bgColor="inherit"
                            />
                          )}
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
          </GeneralBox>
          <GeneralBox maxWidth={300} float="right">
            <Table fontSize="sm" variant="striped" colorScheme="gray">
              <Tbody>
                <Tr>
                  <Td>
                    <strong>Discount:</strong>
                  </Td>
                  <Td textAlign="right">
                    ${Number(getSumOfAllDiscounts(invoices)).toFixed(2)}
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <strong>Invoice Total:</strong>
                  </Td>
                  <Td textAlign="right">
                    {" "}
                    ${Number(getSumOfIvoices(invoices)).toFixed(2)}
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <strong>Total Paid:</strong>
                  </Td>
                  <Td textAlign="right">
                    ${Number(getSumOfIvoices(invoices, true)).toFixed(2)}
                  </Td>
                </Tr>
                <Tr>
                  <Td border="none">
                    <strong>Total Owed:</strong>
                  </Td>
                  <Td border="none" textAlign="right">
                    $
                    {Number(
                      getSumOfIvoices(invoices) -
                        getSumOfIvoices(invoices, true)
                    ).toFixed(2)}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </GeneralBox>
        </PageWrapper>
      )}
      {isLoading && (
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Text fontSize="lg">Loading...</Text>
        </Flex>
      )}
      {isError && (
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Text fontSize="lg">Error!</Text>
        </Flex>
      )}
      {modalOpen && (
        <ConfirmationDeletionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          confirm={handleDeleteInvoice}
        />
      )}
    </>
  );
}
