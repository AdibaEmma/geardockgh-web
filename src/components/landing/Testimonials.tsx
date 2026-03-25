'use client';

interface Testimonial {
  name: string;
  role: string;
  accent: 'gold' | 'teal';
  text: string;
  rating: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Kwame A.',
    role: 'Software Engineer, Bolgatanga',
    accent: 'gold',
    text: 'The Sony headphones are a game-changer for my remote work. Arrived in 2 days. MoMo payment was seamless.',
    rating: 5,
  },
  {
    name: 'Ama D.',
    role: 'YouTube Creator, Kumasi',
    accent: 'teal',
    text: 'Best ring light I\u2019ve found at this price. The quality is exactly what I needed for my studio setup.',
    rating: 5,
  },
  {
    name: 'Kofi M.',
    role: 'Student, Legon',
    accent: 'gold',
    text: 'Affordable laptop stand that\u2019s sturdy and foldable. Perfect for my dorm room. Delivered right to campus.',
    rating: 4,
  },
  {
    name: 'Efua S.',
    role: 'Gamer & Streamer, Tema',
    accent: 'teal',
    text: 'Finally a store that ships real gaming gear to Ghana. The mechanical keyboard feels premium.',
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="testimonial-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <div className={`star${i < count ? '' : ' empty'}`} key={i} />
      ))}
    </div>
  );
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('');
}

function TestimonialCard({ t }: { t: Testimonial }) {
  const initials = getInitials(t.name);
  return (
    <div className="testimonial-card">
      <div className="testimonial-header">
        <div className={`testimonial-avatar testimonial-avatar--${t.accent}`}>
          <span>{initials}</span>
        </div>
        <div>
          <div className="testimonial-name">{t.name}</div>
          <div className="testimonial-role">{t.role}</div>
        </div>
      </div>
      <div className="testimonial-text">&ldquo;{t.text}&rdquo;</div>
      <Stars count={t.rating} />
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="testimonials">
      <div className="section-tag">// WHAT CUSTOMERS SAY</div>
      <h2 className="section-title">
        Real reviews from<br />real buyers.
      </h2>
      <div className="testimonials-track">
        {TESTIMONIALS.map((t) => (
          <TestimonialCard key={t.name} t={t} />
        ))}
        {/* Duplicate for seamless loop */}
        {TESTIMONIALS.map((t) => (
          <TestimonialCard key={`dup-${t.name}`} t={t} />
        ))}
      </div>
    </section>
  );
}
