import HeroSearch from '@/components/HeroSearch';
import SectionGetStarted from '@/components/SectionGetStarted';
import SectionNewLaunches from '@/components/SectionNewLaunches';
import SectionTrending from '@/components/SectionTrending';
import SectionFeatured from '@/components/SectionFeatured';
import SectionCities from '@/components/SectionCities';
import SectionBlogs from '@/components/SectionBlogs';
import SectionServices from '@/components/SectionServices';

export default function HomePage() {
  return (
    <>
      <HeroSearch />
      <SectionGetStarted />
      <SectionNewLaunches />
      <SectionTrending />
      <SectionFeatured />
      <SectionCities />
      <SectionBlogs />
      <SectionServices />
    </>
  );
}
