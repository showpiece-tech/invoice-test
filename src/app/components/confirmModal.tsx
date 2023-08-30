import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Delete Invoice</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure? You can&apos;t undo this action afterwards.
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onDelete}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
