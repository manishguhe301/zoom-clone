'use client';

import React from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';
import Link from 'next/link';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

const MobileNav = () => {
  const pathName = usePathname();

  return (
    <section className='w-full max-w-[260px] '>
      <Sheet>
        <SheetTrigger asChild className='cursor-pointer'>
          <Image src='icons/hamburger.svg' alt='menu' width={36} height={36} />
        </SheetTrigger>
        <SheetContent side='left' className='border-none bg-dark-1'>
          <Link href='/' className='flex items-center gap-1'>
            <Image
              src='/icons/logo.svg'
              alt='logo'
              width={32}
              height={32}
              className='max-sm:size-10'
            />
            <p className='text-[26px] font-extrabold text-white'>Zoomix</p>
          </Link>
          <div className='flex flex-col justify-between h-[calc(100vh - 72px)] overflow-y-auto'>
            <SheetClose asChild>
              <section className='flex h-full flex-col gap-6 pt-16 text-white'>
                {sidebarLinks.map((link, index) => {
                  const isActive =
                    pathName === link.route ||
                    pathName.startsWith(`${link.route}/`);
                  return (
                    <SheetClose
                      asChild
                      key={`${link.label}-${link.route}-${isActive}`}
                    >
                      <Link
                        href={link.route}
                        className={cn(
                          'flex gap-4 items-center p-4 rounded-lg w-full max-w-60 cursor-pointer',
                          {
                            'bg-blue-1': isActive,
                          }
                        )}
                        key={`${link.label}-${link.route}-${isActive}`}
                      >
                        <Image
                          src={link.imgURL}
                          alt={link.label}
                          width={20}
                          height={20}
                        />
                        <p className='font-semibold'>{link.label}</p>
                      </Link>
                    </SheetClose>
                  );
                })}
              </section>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
