import CryptoAnalysisClient from '@/app/components/Server/analysis';
import { generateMetadata } from '@/app/helper/generateMetadata';
import React from 'react';

export const metadata = generateMetadata(
  "JadenX.AI - System Analysis",
  "Real-time system analysis monitoring for JadenX.AI platform"
);

const CryptoAnalysisPage = () => {
  return <CryptoAnalysisClient />;
};

export default CryptoAnalysisPage;