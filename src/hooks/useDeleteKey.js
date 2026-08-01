import { useEffect } from "react";

// Delete / Backspace removes the selected layer, unless the user is typing in
// a field or a modal is holding focus.
export function useDeleteKey(enabled, onDelete) {
  useEffect(() => {
    if (!enabled) return;
    const handleKeyDown = (event) => {
      if (event.key !== "Delete" && event.key !== "Backspace") return;
      const target = event.target;
      if (target instanceof HTMLElement && (target.isContentEditable || target.closest("input, textarea, select"))) {
        return;
      }
      event.preventDefault();
      onDelete();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onDelete]);
}
