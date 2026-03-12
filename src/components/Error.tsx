export default function Error({
  error,
  className,
}: {
  error: String;
  className?: String;
}) {
  return (
    <h1
      className={`text-center text-destructive text-lg font-semibold ${className}`}
    >
      {error}
    </h1>
  );
}
