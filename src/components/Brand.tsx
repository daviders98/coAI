type BrandProps = {
  className?: string;
};

export function Brand({ className }: BrandProps) {
  return (
    <span className={className}>
      <span className="font-semibold">co</span>
      <span className="font-bold text-primary">AI</span>
    </span>
  );
}
