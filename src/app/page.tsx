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
  getInvoiceDiscount,
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
    <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Modal Title</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text fontWeight="bold" mb="1rem">
            You can scroll the content behind the modal
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button variant="ghost">Secondary Action</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default function Home() {
  const { invoices, customer, isLoading, isError } =
    useInvoicesAndCustomerApi();

  const [modalOpen, setModalOpen] = useState(false);

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
                    invoices.map(
                      (
                        {
                          number,
                          id,
                          dateDue,
                          dateIssued,
                          settled,
                          items,
                          discount,
                        },
                        index
                      ) => (
                        <Tr key={id} color={!settled ? "red" : undefined}>
                          <Td
                            position="sticky"
                            top={0}
                            left={0}
                            zIndex={50}
                            bgColor={index % 2 != 0 ? "white" : undefined}
                          >
                            {number}
                          </Td>
                          <Td>{formatDateDDMMYY(dateDue as string)}</Td>
                          <Td>{formatDateDDMMYY(dateIssued as string)}</Td>
                          <Td color={discount ? "green" : undefined}>
                            $
                            {Number(
                              getInvoiceAmount({ items } as Invoice)
                            ).toFixed(2)}
                          </Td>
                          <Td>
                            {!settled && (
                              <IconButton
                                aria-label="Delete Invoice"
                                icon={<DeleteIcon color="red" />}
                                onClick={() => setModalOpen(true)}
                                bgColor="inherit"
                              />
                            )}
                          </Td>
                        </Tr>
                      )
                    )}
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
    </>
  );
}
