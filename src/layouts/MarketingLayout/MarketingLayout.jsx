import { Outlet } from 'react-router-dom';
import MarketingNavbar from './MarketingNavbar';
import MarketingFooter from './MarketingFooter';
import styles from './MarketingLayout.module.css';

export const MarketingLayout = () => {
  return (
    <div className={styles.layout}>
      <MarketingNavbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <MarketingFooter />
    </div>
  );
};

export default MarketingLayout;
