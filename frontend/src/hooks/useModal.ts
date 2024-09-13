import { useState } from 'react';

/**
 * Reusable hook to manage modal features.
 */
const useModal = () => {
  const [open, setOpen] = useState<boolean>(false);

  const handleToggleModal = (openState: boolean) => {
    setOpen(openState);
  }

  return {
    open,
    handleToggleModal,
  }
}

export default useModal;