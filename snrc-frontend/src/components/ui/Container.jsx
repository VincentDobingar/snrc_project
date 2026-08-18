export default function Container({ className = "", children }) {
  return <div className={`container-snrc ${className}`}>{children}</div>;
}