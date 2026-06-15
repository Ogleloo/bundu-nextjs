// ============================================================
// MENU PAGE — /menu
// Full menu view (same component as homepage preview)
// ============================================================
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChalkboardMenu } from '@/components/Menu';
import FloatingButtons from '@/components/UI/FloatingButtons';

export default function MenuPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <ChalkboardMenu />
      </main>
      <Footer />
      <FloatingButtons />
    </>
  );
}
