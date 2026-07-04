import Link from 'next/link';
import { OUTPUT_STYLES } from '@/lib/types';

export default function HomePage() {
  return (
    <div className="container-arwin">
      {/* Hero */}
      <section className="flex flex-col items-center py-24 text-center md:py-32">
        <span className="eyebrow animate-fade-up">AI Fashion Studio</span>
        <h1 className="mt-6 max-w-3xl animate-fade-up text-5xl font-semibold leading-[1.05] tracking-tight text-ink md:text-7xl">
          AI virtual try-on for fashion brands.
        </h1>
        <p className="mt-6 max-w-xl animate-fade-up text-lg text-ink/60">
          Upload a garment and generate realistic model try-ons, ghost
          mannequin, flat lay and studio visuals — ready for e-commerce,
          Instagram, TikTok and Shopify.
        </p>
        <div className="mt-10 flex animate-fade-up flex-col gap-3 sm:flex-row">
          <Link href="/upload" className="btn-primary px-8 py-4 text-base">
            Start creating
          </Link>
          <Link href="/gallery" className="btn-secondary px-8 py-4 text-base">
            View gallery
          </Link>
        </div>
      </section>

      {/* Style showcase */}
      <section className="py-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {OUTPUT_STYLES.map((s, i) => (
            <div
              key={s.id}
              className="card group flex flex-col justify-between p-6 transition-shadow hover:shadow-soft"
            >
              <span className="text-3xl font-light text-ink/20">
                0{i + 1}
              </span>
              <div className="mt-10">
                <h3 className="text-base font-medium text-ink">{s.title}</h3>
                <p className="mt-1 text-sm text-ink/50">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">Workflow</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-ink md:text-4xl">
            From flat product shot to campaign-ready in seconds.
          </h2>
        </div>
        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {[
            {
              t: 'Upload',
              d: 'Drop in your garment image. We remove the background and detect the clothing category automatically.',
            },
            {
              t: 'Choose a style',
              d: 'Model try-on, ghost mannequin, flat lay or studio — pick the look that fits the channel.',
            },
            {
              t: 'Generate & export',
              d: 'Get a photoreal result with fabric, seams and logos preserved. Export PNG/JPG or save to your gallery.',
            },
          ].map((step, i) => (
            <div key={step.t} className="flex flex-col gap-3">
              <span className="text-sm font-medium tracking-brand text-ink/40">
                STEP {i + 1}
              </span>
              <h3 className="text-xl font-medium text-ink">{step.t}</h3>
              <p className="text-sm leading-relaxed text-ink/55">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mb-8 rounded-2xl bg-ink px-8 py-20 text-center text-white">
        <h2 className="mx-auto max-w-2xl text-4xl font-semibold tracking-tight">
          Your next product shoot doesn&apos;t need a studio.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-white/60">
          Create realistic fashion visuals from a single photo.
        </p>
        <Link
          href="/upload"
          className="mt-8 inline-flex rounded-full bg-white px-8 py-4 text-base font-medium text-ink transition-transform hover:scale-[1.02]"
        >
          Start creating
        </Link>
      </section>
    </div>
  );
}
