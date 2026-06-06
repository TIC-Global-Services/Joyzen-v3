import Image from "next/image";

type JoyzenLogoProps = {
  alt?: string;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
};

export default function JoyzenLogo({
  alt = "Joyzen",
  className,
  imageClassName,
  priority = false,
  sizes = "240px",
}: JoyzenLogoProps) {
  return (
    <div className={className}>
      <Image
        src="/images/joyzen.png"
        alt={alt}
        width={609}
        height={160}
        priority={priority}
        sizes={sizes}
        className={`h-auto w-full ${imageClassName ?? ""}`}
      />
    </div>
  );
}
