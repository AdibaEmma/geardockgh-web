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
import { SocialProofToast } from '@/components/ui/SocialProofToast';
import { BackToTop } from '@/components/ui/BackToTop';
import { MobileBottomNav } from '@/components/ui/MobileBottomNav';
import { WebSiteJsonLd } from '@/components/seo/JsonLd';

export default function HomePage() {
  return (
    <div className="landing-page">
      <WebSiteJsonLd />
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
      <SocialProofToast />
      <BackToTop />
      <MobileBottomNav />
    </div>
  );
}
