import Image from 'next/image';
import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-pink-500 to-pink-600 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-20 h-6">
              <Image 
                src="/logo-vero.svg" 
                alt="Vero" 
                fill
                className="object-contain brightness-0 invert"
                priority
              />
            </div>
            <span className="text-white text-2xl font-light">+</span>
            <div className="relative w-24 h-5">
              <Image 
                src="/logo-mediquo.svg" 
                alt="MediQuo" 
                fill
                className="object-contain brightness-0 invert"
                priority
              />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}