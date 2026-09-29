"use client";

import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Universe } from "@/components/Universe";
import { Ecosystem } from "@/components/Ecosystem";
import { Token } from "@/components/Token";
import { Roadmap } from "@/components/Roadmap";
import { Community } from "@/components/Community";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <About />
        <Universe />
        <Ecosystem />
        <Token />
        <Roadmap />
        <Community />
      </main>
      <Footer />
    </>
  );
}