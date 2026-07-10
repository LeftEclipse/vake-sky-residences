import { useState, type FormEvent } from "react";
import aerialNight from "@/assets/aerial-night.jpg";
import { MagneticButton } from "@/components/motion/MagneticButton";

const FIELDS = [
  { id: "name", label: "Name", type: "text", autoComplete: "name" },
  { id: "email", label: "Email", type: "email", autoComplete: "email" },
  { id: "phone", label: "Phone", type: "tel", autoComplete: "tel" },
] as const;

export function Enquiry() {
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <section id="contact" className="relative min-h-screen overflow-hidden bg-midnight" aria-labelledby="enquiry-heading">
      <img
        src={aerialNight}
        alt=""
        aria-hidden="true"
        loading="lazy"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-midnight/70 via-midnight/20 to-transparent" />

      <div className="relative z-10 grid min-h-screen grid-cols-1 items-center gap-10 px-6 py-28 md:grid-cols-2 md:px-24">
        <div className="text-ivory">
          <p className="tech-label text-ivory/60">08 — Private Presentation</p>
          <h2 id="enquiry-heading" className="display-serif mt-6" style={{ fontSize: "clamp(3rem, 7vw, 7rem)" }}>
            YOUR PLACE<br />
            <span className="italic text-gold">ABOVE THE CITY.</span>
          </h2>
        </div>

        {/* ivory enquiry panel overlapping the image */}
        <div className="bg-ivory p-8 text-charcoal md:-mr-8 md:p-14 lg:ml-16">
          {sent ? (
            <div className="py-14 text-center">
              <p className="display-serif text-4xl">Thank you.</p>
              <p className="tech-label mt-6 text-charcoal/60">
                Our sales atelier will contact you shortly
              </p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <p className="text-sm leading-relaxed text-charcoal/60">
                Request availability, floor plans and a private presentation.
              </p>
              <div className="mt-8 space-y-7">
                {FIELDS.map((f) => (
                  <div key={f.id}>
                    <label htmlFor={f.id} className="tech-label block text-charcoal/60">
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      type={f.type}
                      required
                      autoComplete={f.autoComplete}
                      className="mt-2 w-full border-b border-charcoal/30 bg-transparent py-2 font-sans text-lg outline-none transition-colors focus:border-gold"
                    />
                  </div>
                ))}
                <div>
                  <label htmlFor="preference" className="tech-label block text-charcoal/60">
                    Residence Preference
                  </label>
                  <select
                    id="preference"
                    className="mt-2 w-full border-b border-charcoal/30 bg-transparent py-2 font-sans text-lg outline-none focus:border-gold"
                  >
                    <option>1 Bedroom</option>
                    <option>2 Bedrooms</option>
                    <option>3 Bedrooms</option>
                    <option>Penthouse Collection</option>
                  </select>
                </div>
              </div>

              <MagneticButton
                type="submit"
                cursorLabel="SELECT"
                className="btn-fill group tech-label mt-10 flex w-full items-center justify-between border border-charcoal px-8 py-5 text-charcoal transition-colors duration-500 hover:text-ivory"
              >
                <span>Request Private Presentation</span>
                <span aria-hidden="true" className="inline-block transition-transform duration-500 group-hover:translate-x-3">
                  →
                </span>
              </MagneticButton>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
