export default function AdSlot({
  label = "Ruang iklan",
  className = "",
  minHeight = "90px",
}) {
  return (
    <div
      className={`ad-slot ${className}`}
      style={{ minHeight }}
      data-ad-slot={label}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}
