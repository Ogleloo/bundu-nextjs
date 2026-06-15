// ============================================================
// STORY SECTION — about the restaurant
// Edit this file to: change the story text, add real photo
// ============================================================
export default function StorySection() {
  return (
    <section className="px-4 md:px-8 py-16 max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-center">
      <div>
        <p className="font-script text-2xl text-burgundy mb-1">our story</p>
        <h2 className="font-display text-3xl mb-4">More than a restaurant</h2>
        <p className="text-ink-soft text-sm leading-relaxed mb-3">
          Bundu Foods started as a small kitchen near UNIZULU with one goal: feed
          students and locals food that actually tastes like home. Today we&apos;re a
          restaurant, a lounge, and a catering kitchen all in one — a place where
          breakfast turns into business meetings and Friday lunch turns into Saturday
          morning.
        </p>
        <p className="text-ink-soft text-sm leading-relaxed">
          Whether you&apos;re grabbing a quick breakfast before class, hosting an event,
          or need catering for something bigger — we&apos;ve got you covered.
        </p>
      </div>
      <div className="aspect-[4/3] rounded-md flex items-center justify-center text-center p-6 text-paper/60 text-sm"
        style={{ background: 'linear-gradient(135deg, var(--chalk-bg), var(--moss-deep))' }}>
        📸 Add your restaurant photo here
      </div>
    </section>
  );
}
