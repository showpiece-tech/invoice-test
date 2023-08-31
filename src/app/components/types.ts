import { RefObject } from "react";

export interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  leastDestructiveRef: RefObject<HTMLButtonElement>;
}
