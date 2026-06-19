Output

// ============================================================
// HOME PAGE — / (public)
// Assembles: Navbar, Hero, Menu preview, Story, Catering/Events,
// Find Us, Footer. All content components live in src/components.
// ============================================================
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import { ChalkboardMenu } from '@/components/Menu';
import { StorySection, CateringEventsSection, FindUsSection } from '@/components/Home';
import FloatingButtons from '@/components/UI/FloatingButtons';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ChalkboardMenu />
        <StorySection />
        <CateringEventsSection />
        <FindUsSection />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
