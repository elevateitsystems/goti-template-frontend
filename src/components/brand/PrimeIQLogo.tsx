import Image from "next/image";

interface PrimeIQLogoProps {
  className?: string;
  priority?: boolean;
  variant?: "horizontal" | "icon";
}

export function PrimeIQLogo({
  className = "h-auto w-full",
  priority = false,
  variant = "horizontal",
}: PrimeIQLogoProps) {
  const isIcon = variant === "icon";

  return (
    <Image
      src={isIcon ? "/images/primeiq-brain-icon.png" : "/images/primeiq-logo.png"}
      alt={isIcon ? "PrimeIQ brain icon" : "PrimeIQ"}
      width={isIcon ? 1254 : 1983}
      height={isIcon ? 1254 : 793}
      className={className}
      priority={priority}
    />
  );
}
