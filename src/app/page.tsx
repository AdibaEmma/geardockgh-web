import {
  CustomCursor,
  Navbar,
  Hero,
  Ticker,
  TrustBar,
  Categories,
  FeaturedProducts,
  FlashDeal,
  HowItWorks,
  Testimonials,
  WhyUs,
  Newsletter,
  Footer,
} from '@/components/landing';

export default function HomePage() {
  return (
    <div className="landing-page">
      <CustomCursor />
      <Navbar />
      <Hero />
      <Ticker />
      <TrustBar />
      <Categories />
      <FeaturedProducts />
      <FlashDeal />
      <HowItWorks />
      <Testimonials />
      <WhyUs />
      <Newsletter />
      <Footer />
    </div>
  );
}
