import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';

interface DeletePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (itemId: string) => void; // Include the invoiceId parameter
  itemId: string; // Include the invoiceId as a prop
}

const DeletePopup: React.FC<DeletePopupProps> = ({ isOpen, onClose, onDelete, itemId }) => {
  const handleDelete = () => {
    // Call onDelete with the itemId parameter
    onDelete(itemId);

    // Close the delete popup
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Confirmation</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Are you sure you want to delete this item?</ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={handleDelete}>
            Yes
          </Button>
          <Button variant="ghost" onClick={onClose}>
            No
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeletePopup;
