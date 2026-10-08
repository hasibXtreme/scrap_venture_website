import SiteLayout from '../components/SiteLayout.jsx';
import Hero from '../components/Hero.jsx';
import Materials from '../components/Materials.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import WhyScrapVenture from '../components/WhyScrapVenture.jsx';
import AwardsMarquee from '../components/AwardsMarquee.jsx';
import Reviews from '../components/Reviews.jsx';
import CtaFinal from '../components/CtaFinal.jsx';

export default function Home() {
  return (
    <SiteLayout variant="home">
      <Hero />
      <Materials />
      <HowItWorks />
      <WhyScrapVenture />
      <AwardsMarquee />
      <Reviews />
      <CtaFinal />
    </SiteLayout>
  );
}
