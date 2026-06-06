import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const destinations = [
  { name: "Srinagar", tag: "Dal Lake", hue: "from-kashmir-blue to-emerald-brand" },
  { name: "Gulmarg", tag: "Snow & Skiing", hue: "from-sky-500 to-kashmir-blue" },
  { name: "Pahalgam", tag: "Valley of Shepherds", hue: "from-emerald-brand to-emerald-deep" },
  { name: "Sonamarg", tag: "Meadow of Gold", hue: "from-gold to-emerald-brand" },
  { name: "Yusmarg", tag: "Meadow of Jesus", hue: "from-emerald-brand to-kashmir-blue" },
  { name: "Doodhpathri", tag: "Valley of Milk", hue: "from-cyan-500 to-kashmir-blue" },
  { name: "Bangus Valley", tag: "Hidden Paradise", hue: "from-emerald-deep to-charcoal" },
  { name: "Lolab Valley", tag: "Land of Springs", hue: "from-kashmir-blue to-navy" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function DestinationsSection() {
  return (
    <section id="destinations" className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="text-center mb-14"
      >
        <h2 className="font-display text-4xl md:text-5xl text-charcoal">
          Explore <span className="text-gradient-brand">Kashmir</span>
        </h2>
        <div className="mt-4 mx-auto h-1 w-24 rounded-full bg-gradient-brand" />
      </motion.div>

      <div className="flex md:grid md:grid-cols-4 gap-5 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-4 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0">
        {destinations.map((d, i) => (
          <motion.div
            key={d.name}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            transition={{ delay: (i % 4) * 0.1, duration: 0.6, ease: "easeOut" }}
            className="snap-start shrink-0 w-[70%] sm:w-[45%] md:w-auto"
          >
            <div
              className={`group relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br ${d.hue} text-white cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl`}
            >
              <div className="absolute inset-0 opacity-30"
                style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.6), transparent 55%)" }} />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-500" />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <div className="font-display text-2xl font-bold leading-tight drop-shadow">{d.name}</div>
                <div className="text-sm italic text-white/85 mt-1">{d.tag}</div>
                <button className="mt-4 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 inline-flex items-center gap-2 self-start px-4 py-2 rounded-full bg-white text-emerald-brand text-sm font-semibold">
                  Explore <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
