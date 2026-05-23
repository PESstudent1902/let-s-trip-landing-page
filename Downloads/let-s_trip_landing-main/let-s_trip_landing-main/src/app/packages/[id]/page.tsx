import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchDestinations, fetchPackages } from "@/app/actions";

export default async function PackageDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [destinations, packages] = await Promise.all([fetchDestinations(), fetchPackages()]);

  const pkg = packages.find((p) => p.id === id);
  if (!pkg) return notFound();

  const destination = pkg.destinationId ? destinations.find((d) => d.id === pkg.destinationId) : undefined;

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-abyss via-deep-space to-abyss" />

      <section className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 md:px-12 pt-28 pb-12">
        <Link href="/#packages" className="text-text-muted hover:text-cyan transition-colors text-sm">
          ← Back to packages
        </Link>

        <div className="mt-6 glass rounded-3xl overflow-hidden border border-white/10">
          <div className="relative h-56 sm:h-72">
            <Image src={pkg.image} alt={pkg.name} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-abyss via-abyss/40 to-transparent" />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-5xl text-white" style={{ fontFamily: "var(--font-brush)" }}>
                  {pkg.name}
                </h1>
                <p className="text-text-secondary mt-1" style={{ fontFamily: "var(--font-handwritten)" }}>
                  {destination?.name ? `${destination.name} · ` : ""}
                  per person
                  {typeof pkg.durationNights === "number" ? ` · ${pkg.durationNights} nights` : ""}
                </p>
              </div>
              <div className="text-cyan text-3xl sm:text-4xl text-glow-cyan" style={{ fontFamily: "var(--font-brush)" }}>
                {pkg.price}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-6">
              {pkg.highlights.map((h) => (
                <span
                  key={h}
                  className="px-3 py-1 rounded-full border border-dashed border-white/10 text-xs text-text-secondary bg-white/5"
                  style={{ fontFamily: "var(--font-handwritten)" }}
                >
                  {h}
                </span>
              ))}
              {(pkg.tags || []).map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full border border-dashed border-cyan/20 text-xs text-cyan bg-cyan/10"
                  style={{ fontFamily: "var(--font-handwritten)" }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-[1100px] mx-auto px-4 sm:px-6 md:px-12 pb-28">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-5xl text-white" style={{ fontFamily: "var(--font-brush)" }}>
            Your <span className="text-cyan text-glow-cyan">Itinerary</span>
          </h2>
          <p className="text-text-secondary mt-2" style={{ fontFamily: "var(--font-handwritten)" }}>
            A day-by-day plan you can customize with our team.
          </p>
        </div>

        <div className="space-y-4">
          {(pkg.itinerary || []).length ? (
            pkg.itinerary!.map((day) => (
              <div key={day.day} className="glass rounded-2xl border border-white/10 overflow-hidden">
                <div className="flex items-center justify-between gap-4 p-5 sm:p-6 bg-white/5 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan/15 border border-cyan/20 flex items-center justify-center text-cyan font-bold">
                      {day.day}
                    </div>
                    <div>
                      <p className="text-text-muted text-xs" style={{ fontFamily: "var(--font-handwritten)" }}>
                        Day {day.day}
                      </p>
                      <p className="text-white font-bold" style={{ fontFamily: "var(--font-headline)" }}>
                        {day.title}
                      </p>
                    </div>
                  </div>
                </div>

                <ul className="p-5 sm:p-6 space-y-2">
                  {day.details.map((d) => (
                    <li key={d} className="text-text-secondary text-sm flex gap-3">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-cyan/70 flex-shrink-0" />
                      <span style={{ fontFamily: "var(--font-handwritten)" }}>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <div className="glass rounded-2xl border border-white/10 p-8 text-center text-text-secondary">
              No itinerary details yet. Message us on WhatsApp and we’ll tailor it for you.
            </div>
          )}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://wa.me/918867767171"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-green-600 text-white font-bold text-sm text-center hover:opacity-90 transition-opacity"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            Chat on WhatsApp
          </a>
          <Link
            href="/#packages"
            className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm text-center hover:bg-white/10 transition-colors"
            style={{ fontFamily: "var(--font-headline)" }}
          >
            Browse more packages
          </Link>
        </div>
      </section>
    </main>
  );
}

