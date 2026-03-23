import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const Header = ({ children, className }: HeaderProps) => {
  return (
    <div className={cn("header", className)}>
      <Link href="/" className="md:flex-1 flex items-center gap-3">
        <Image
          src="/assets/icons/logo-icon.svg"
          alt="Logo"
          width={40}
          height={40}
          className="hidden md:block"
          priority
        />
        <span className="hidden md:block text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-500 bg-clip-text text-transparent">
          SyncDocs
        </span>
        <Image
          src="/assets/icons/logo-icon.svg"
          alt="Logo"
          width={32}
          height={32}
          className="mr-2 md:hidden"
          priority
        />
      </Link>
      {children}
    </div>
  );
};

export default Header;
