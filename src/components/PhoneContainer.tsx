'use client';

import { ReactNode } from 'react';

interface PhoneContainerProps {
  children: ReactNode;
}

export default function PhoneContainer({ children }: PhoneContainerProps) {
  return (
    <div className="phone-container">
      {children}
    </div>
  );
}
