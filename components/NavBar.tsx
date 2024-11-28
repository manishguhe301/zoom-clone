import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import MobileNav from './MobileNav';
import { SignedIn, UserButton } from '@clerk/nextjs';

const NavBar = () => {
  return (
    <nav className='flex flex-between fixed z-50 w-full bg-dark-1 px-6 py-4  lg:px-10'>
      <Link href='/' className='flex items-center gap-1'>
        <Image
          src='/icons/logo.svg'
          alt='logo'
          width={32}
          height={32}
          className='max-sm:size-10'
        />
        <p className='text-[26px] font-extrabold text-white max-sm:hidden'>
          Zoomix
        </p>
      </Link>
      <div className='flex-between gap-5'>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'h-10 w-10',
                userButtonPopoverActionButton__manageAccount:
                  'bg-dark-1 text-white hover:text-gray-100',
                userButtonPopoverActionButton__signOut:
                  'bg-dark-1 text-white hover:text-gray-100',
              },
            }}
          />
        </SignedIn>
        <MobileNav />
      </div>
    </nav>
  );
};

export default NavBar;
