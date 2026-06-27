import { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import FeaturedCategories from '@/components/FeaturedCategories';
import FeaturedCourses from '@/components/FeaturedCourses';
import WhyLaneAcademy from '@/components/WhyLaneAcademy';
import PrivacyHighlight from '@/components/PrivacyHighlight';

export const metadata: Metadata = {
  title: "Lane Academy — Learn the Skills Life Doesn't Always Teach",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedCourses />
      <WhyLaneAcademy />
      <PrivacyHighlight />
    </>
  );
}
