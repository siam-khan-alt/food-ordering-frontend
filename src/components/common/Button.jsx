export default function Button({ children, variant = "primary", icon, ...props }) {
  const baseStyle = "px-7 py-3.5 rounded-xl font-bold transition-all text-xs tracking-wide flex items-center space-x-2";

  const variants = {
    primary: "group bg-brand hover:bg-brand-hover text-white shadow-lg shadow-brand/20 transform hover:-translate-y-0.5",
    secondary: "border border-card-border bg-card-bg/50 backdrop-blur-sm text-text-main hover:border-brand/40 hover:text-brand shadow-sm"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]}`} {...props}>
      <span>{children}</span>
      {icon}
    </button>
  );
}