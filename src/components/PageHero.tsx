import { motion } from "framer-motion";

export default function PageHero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 overflow-hidden bg-gradient-to-br from-navy via-navy to-kashmir-blue text-white">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(201,168,76,0.6), transparent 50%), radial-gradient(circle at 80% 70%, rgba(74,144,196,0.5), transparent 50%)" }} />
      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-display text-5xl md:text-6xl font-bold"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        )}
        <div className="mt-6 mx-auto h-1 w-24 bg-gold rounded-full" />
      </div>
    </section>
  );
}
