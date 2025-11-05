import { useState } from "react";

export default function useDialog(initialOpen = false) {
  const [open, setOpen] = useState(initialOpen);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const toggle = () => setOpen((prev) => !prev);

  return [open, handleOpen, handleClose, toggle] as const;
}
