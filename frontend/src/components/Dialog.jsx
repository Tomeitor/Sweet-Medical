import { useEffect, useId } from "react";

export function Dialog({
  isOpen,
  title,
  description,
  onClose,
  children,
  footer,
}) {
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="dialog-backdrop" onClick={onClose}>
      <div
        className="dialog-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="dialog-header">
          <div>
            <h2 id={titleId}>{title}</h2>
            {description ? (
              <p id={descriptionId} className="dialog-description">
                {description}
              </p>
            ) : null}
          </div>
          <button
            type="button"
            className="dialog-close"
            onClick={onClose}
            aria-label="Cerrar diálogo"
          >
            ×
          </button>
        </div>

        <div className="dialog-body">{children}</div>

        {footer ? <div className="dialog-footer">{footer}</div> : null}
      </div>
    </div>
  );
}
