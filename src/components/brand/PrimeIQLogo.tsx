import Image from "next/image";

interface PrimeIQLogoProps {
  className?: string;
  priority?: boolean;
}

export function PrimeIQLogo({ className = "h-auto w-full", priority = false }: PrimeIQLogoProps) {
  return (
    <Image
      src="/images/primeiq-logo.png"
      alt="PrimeIQ"
      width={1312}
      height={1199}
      className={className}
      priority={priority}
    />
  );
}
