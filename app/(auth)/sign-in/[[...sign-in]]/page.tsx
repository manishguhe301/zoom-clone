import { SignIn } from '@clerk/nextjs';
import React from 'react';

const SignInPage = () => {
  return (
    <main className='h-screen flex w-full items-center justify-center'>
      <SignIn
        appearance={{
          elements: {
            socialButtonsBlockButton__google:
              'bg-white text-black hover:bg-gray-100',
          },
        }}
      />
    </main>
  );
};

export default SignInPage;
