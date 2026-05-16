"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function MemorialSection() {
  return (
    <section className="py-24 px-6 md:px-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="bg-card/40 backdrop-blur-md border border-border/40 rounded-[48px] p-10 md:p-20 text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative overflow-hidden group"
        >
          {/* Subtle Corner Accents */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent opacity-20 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-primary/10 to-transparent opacity-20 pointer-events-none" />

          {/* Photo / Icon Area */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-32 h-32 md:w-44 md:h-44 mx-auto rounded-full bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent border border-primary/20 flex items-center justify-center mb-12 relative"
          >
             <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse-slow pointer-events-none" />
             <Heart className="w-12 h-12 md:w-16 md:h-16 text-primary/60 fill-primary/5" />
             
             {/* Decorative Ring */}
             <div className="absolute inset-[-8px] border border-primary/10 rounded-full opacity-50 scale-95 group-hover:scale-100 transition-transform duration-1000" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <span className="inline-block text-primary/60 text-xs font-black uppercase tracking-[0.3em] mb-4">
              Eternal Tribute
            </span>
            <h2 className="font-playfair text-3xl md:text-4xl font-medium text-foreground/80 mb-2 italic">
              In loving memory of
            </h2>
            <h3 className="font-playfair text-5xl md:text-7xl font-black text-foreground mb-10 tracking-tight">
              Jad Kobeissi
            </h3>
            
            <div className="w-20 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto mb-12" />

            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-muted-foreground text-lg md:text-2xl leading-relaxed font-light italic">
                &ldquo;Jad wasn&apos;t just a friend, he was a brother, a partner and the driving force of this creation. He always managed to drive us to do our best and even now he still finds a way to get in my head and push me to do the best I can. Without him this project would simply stay a dream in my head too shy to become a reality. He was the backbone of Save My Conference, and to this day he still is, for his ideas, his passion, and his determination that built SMC into what it is. I wish you could see this Jad.&rdquo;
              </p>
              
              <div className="pt-8">
                <span className="text-primary/40 font-playfair text-lg italic">The Legacy Continues</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
