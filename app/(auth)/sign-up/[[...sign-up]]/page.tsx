import { SignUp } from '@clerk/nextjs';
import React from 'react';

const SignUpPage = () => {
  return (
    <main className='h-screen flex w-full items-center justify-center'>
      <SignUp
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

export default SignUpPage;
