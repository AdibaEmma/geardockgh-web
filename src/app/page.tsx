import {
  CustomCursor,
  Navbar,
  Hero,
  Ticker,
  TrustBar,
  Categories,
  FeaturedProducts,
  PreorderBundles,
  FlashDeal,
  HowItWorks,
  Testimonials,
  WhyUs,
  Newsletter,
  Footer,
} from '@/components/landing';
import { WhatsAppButton } from '@/components/shop/WhatsAppButton';

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
      <PreorderBundles />
      <FlashDeal />
      <HowItWorks />
      <Testimonials />
      <WhyUs />
      <Newsletter />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
