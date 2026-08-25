// ============================================================
// HOME PAGE — / (public)
// Assembles: Navbar, Hero, Menu preview, Story, Events,
// Find Us, Footer. All content components live in src/components.
// ============================================================
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import { ChalkboardMenu } from '@/components/Menu';
import { StorySection, EventsSection, FindUsSection } from '@/components/Home';
import FloatingButtons from '@/components/UI/FloatingButtons';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <ChalkboardMenu />
        <StorySection />
        <EventsSection />
        <FindUsSection />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
