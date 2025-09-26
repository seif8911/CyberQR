'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import PhoneContainer from '@/components/PhoneContainer';
import Navigation from '@/components/Navigation';
import PetCompanion from '@/components/PetCompanion';
import SimpleScreenManager from '@/components/SimpleScreenManager';
export default function Home() {
  const { showPet } = useAppStore();

  useEffect(() => {
    // Show welcome message
    setTimeout(() => {
      showPet('Welcome to CyberQR! Let\'s keep you safe online 🛡️');
    }, 1000);
  }, [showPet]);

  return (
    <PhoneContainer>
      <SimpleScreenManager />
      <Navigation />
      <PetCompanion />
    </PhoneContainer>
  );
}
