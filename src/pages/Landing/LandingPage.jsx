import {
  Hero,
  ProductPreview,
  Features,
  HowItWorks,
  CTA,
} from '../../features/landing';

export const LandingPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <Hero />
      <ProductPreview />
      <Features />
      <HowItWorks />
      <CTA />
    </div>
  );
};

export default LandingPage;
