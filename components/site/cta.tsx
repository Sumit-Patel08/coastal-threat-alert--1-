"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-600 py-24 text-white">
      <div className="absolute inset-0 bg-[url('/public/coastal-wave-pattern.svg')] opacity-10" />
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight sm:text-4xl"
          >
            Ready to protect your coastal community?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100"
          >
            Join hundreds of organizations already using our platform to monitor and respond to coastal threats.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              <Link href="/auth/sign-up">Get started for free</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="text-white hover:bg-white/10">
              <Link href="/demo">Watch demo</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
