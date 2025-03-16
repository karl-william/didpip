'use client';

import MainLayout from '@/components/layout/MainLayout';
import HundredsSquare from '@/components/data-viz/HundredsSquare';

export default function HundredsSquarePage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Hundreds Square</h1>
        <p className="mb-6">
          Explore number patterns and times tables using this interactive hundreds square. 
          Click on individual numbers to highlight them or use the controls to highlight times tables.
        </p>
        
        <HundredsSquare />
      </div>
    </MainLayout>
  );
}
