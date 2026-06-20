import toast from "react-hot-toast";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const baseStyle = {
  background: "var(--color-card-bg)",
  color: "var(--color-text-main)",
  border: "1px solid var(--color-card-border)",
  borderRadius: "12px",
  padding: "12px 16px",
  fontSize: "14px",
  fontWeight: "600"
};

export const showSuccess = (message) => {
  toast(message, {
    icon: <CheckCircle className="w-5 h-5 text-accent" />,
    style: baseStyle
  });
};

export const showError = (message) => {
  toast(message, {
    icon: <XCircle className="w-5 h-5 text-brand" />,
    style: baseStyle
  });
};

export const showConfirm = (message, onConfirm) => {
  toast(
    (t) => (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <span>{message}</span>
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-card-border text-text-main"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="px-3 py-1.5 text-xs font-bold rounded-lg bg-brand text-white"
          >
            Confirm
          </button>
        </div>
      </div>
    ),
    { style: baseStyle, duration: Infinity }
  );
};