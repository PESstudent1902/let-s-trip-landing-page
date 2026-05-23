import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchDestinations, fetchPackages } from "@/app/actions";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Calendar, Compass, ArrowRight, Tag } from "lucide-react";

export default async function DestinationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [destinations, packages] = await Promise.all([fetchDestinations(), fetchPackages()]);

  const destination = destinations.find((d) => d.id === id);
  if (!destination) return notFound();

  // Filter packages that belong to this destination
  const destPackages = packages.filter((pkg) => pkg.destinationId === id);

  return (
    <main className="relative min-h-screen overflow-hidden text-white" style={{ background: "linear-gradient(180deg, #050B1F 0%, #0A1628 100%)" }}>
      <Navbar />

      {/* Hero Banner */}
      <section className="relative h-[50vh] flex items-end">
        <div className="absolute inset-0 z-0">
          <Image src={destination.image} alt={destination.name} fill className="object-cover" priority quality={90} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050B1F] via-[#050B1F]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B1F]/60 via-transparent to-[#050B1F]/60" />
        </div>

        <div className="relative z-10 max-w-[1440px] mx-auto w-full px-4 sm:px-6 md:px-16 pb-12">
          <Link href="/#destinations" className="inline-flex items-center gap-2 text-text-muted hover:text-cyan transition-colors text-sm mb-6 font-semibold">
            ← Back to Destinations
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            {destination.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full border border-dashed border-cyan/30 text-xs text-cyan bg-cyan/10 font-medium">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-5xl sm:text-7xl font-bold leading-tight" style={{ fontFamily: "var(--font-headline)" }}>
            Explore <span className="bg-gradient-to-r from-cyan via-cyan-dim to-violet bg-clip-text text-transparent text-glow-cyan">{destination.name}</span>
          </h1>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="relative z-10 max-w-[1440px] mx-auto px-4 sm:px-6 md:px-16 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left / Main Column: Packages list */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3" style={{ fontFamily: "var(--font-headline)" }}>
              <Compass className="text-cyan animate-[float_6s_ease-in-out_infinite]" size={28} />
              Available Travel Packages
            </h2>

            {destPackages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {destPackages.map((pkg) => (
                  <div key={pkg.id} className="glass rounded-3xl overflow-hidden group hover:border-cyan/20 transition-all duration-500 flex flex-col h-full cursor-pointer border border-white/10">
                    <div className="relative h-48 overflow-hidden">
                      <Image src={pkg.image} alt={pkg.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050B1F]/90 via-transparent to-transparent" />
                      {pkg.durationNights && (
                        <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur text-xs font-semibold text-white">
                          {pkg.durationNights} Nights
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col justify-between flex-1 bg-deep-space">
                      <div>
                        <h3 className="text-2xl font-bold mb-2 group-hover:text-cyan transition-colors" style={{ fontFamily: "var(--font-headline)" }}>{pkg.name}</h3>
                        <p className="text-text-muted text-xs mb-1">Starting from</p>
                        <div className="text-cyan text-3xl font-bold mb-4" style={{ fontFamily: "var(--font-headline)" }}>
                          {pkg.price}
                        </div>
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {pkg.highlights.slice(0, 3).map((h) => (
                            <span key={h} className="px-2.5 py-0.5 rounded-md border border-white/5 bg-white/5 text-[11px] text-text-secondary">
                              {h}
                            </span>
                          ))}
                          {pkg.highlights.length > 3 && (
                            <span className="px-2.5 py-0.5 rounded-md border border-white/5 bg-white/5 text-[11px] text-text-muted">
                              +{pkg.highlights.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                      <Link href={`/packages/${pkg.id}`} className="w-full py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm text-center hover:bg-cyan/15 hover:border-cyan/30 hover:text-cyan transition-all flex items-center justify-center gap-2 group-hover:glow-cyan">
                        View Details & Itinerary <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass rounded-3xl p-12 text-center border border-white/10">
                <p className="text-text-secondary text-lg mb-6">No packages currently listed for this destination.</p>
                <a href={`https://wa.me/918867767171?text=Hi!+I'm+interested+in+traveling+to+${destination.name}.+Can+you+help+me+create+a+custom+itinerary?`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-bold transition-all">
                  Get a Custom Quote
                </a>
              </div>
            )}
          </div>

          {/* Right Column: Destination Info Panel */}
          <div className="lg:col-span-1">
            <div className="glass rounded-3xl border border-white/10 p-8 sticky top-28 bg-[#192122]/60 backdrop-blur-xl">
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-headline)" }}>
                About the Trip
              </h2>
              <p className="text-text-secondary text-base leading-relaxed mb-8">
                {destination.description}
              </p>

              <div className="space-y-6 pt-6 border-t border-white/10">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-cyan/15 border border-cyan/20 text-cyan">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-0.5">Location</h4>
                    <p className="font-bold text-white text-base">{destination.name}</p>
                  </div>
                </div>

                {destination.bestTimeToVisit && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-2xl bg-orange/15 border border-orange/20 text-orange">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-0.5">Best Time to Visit</h4>
                      <p className="font-bold text-white text-sm leading-snug">{destination.bestTimeToVisit}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-2xl bg-violet/15 border border-violet/20 text-violet">
                    <Tag size={20} />
                  </div>
                  <div>
                    <h4 className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-0.5">Estimated Cost</h4>
                    <p className="font-bold text-white text-base">From {destination.price}</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-4">
                <a
                  href={`https://wa.me/918867767171?text=Hi!+I'm+interested+in+traveling+to+${destination.name}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan to-violet text-white font-bold text-sm text-center hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg"
                  style={{ fontFamily: "var(--font-headline)" }}
                >
                  Book My Adventure
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}
