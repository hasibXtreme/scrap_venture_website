import SiteLayout from '../components/SiteLayout.jsx';
import Hero from '../components/Hero.jsx';
import SupportedBy from '../components/SupportedBy.jsx';
import Materials from '../components/Materials.jsx';
import HowItWorks from '../components/HowItWorks.jsx';
import WhyScrapVenture from '../components/WhyScrapVenture.jsx';
import AwardsMarquee from '../components/AwardsMarquee.jsx';
import Reviews from '../components/Reviews.jsx';

export default function Home() {
  return (
    <SiteLayout variant="home">
      <Hero />
      <SupportedBy />
      <Materials />
      <WhyScrapVenture />
      <HowItWorks />
      <AwardsMarquee />
      <Reviews />
    </SiteLayout>
  );
}
