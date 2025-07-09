import CryptoAlertsClient from '@/app/components/Server/alerts';
import { generateMetadata } from '@/app/helper/generateMetadata';

export const metadata = generateMetadata(
  "JadenX.AI - System Alert",
  "Real-time crypto alerts monitoring for JadenX.AI platform"
);

const CryptoAlertsPage = () => {
  return <CryptoAlertsClient />;
};

export default CryptoAlertsPage;