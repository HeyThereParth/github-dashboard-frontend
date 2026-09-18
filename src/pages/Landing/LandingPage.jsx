import {
  Hero,
  EventStream,
  SignalsBento,
  ProductPreview,
  FeatureStories,
  QuestionsSection,
  HowItWorks,
  WhoItsFor,
  CTA,
} from '../../features/landing';

export const LandingPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', overflowX: 'hidden' }}>
      <Hero />
      <EventStream />
      {/* <SignalsBento /> */}
      <ProductPreview />
      <FeatureStories />
      <QuestionsSection />
      <HowItWorks />
      <WhoItsFor />
      <CTA />
    </div>
  );
};

export default LandingPage;
