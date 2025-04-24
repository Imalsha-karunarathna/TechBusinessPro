import AboutSection from "@/components/AboutSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import Navbar from "@/components/Navbar";
import PartnerSection from "@/components/PartnerSection";
import SolutionsSection from "@/components/SolutionsSection";
import TrustedBySection from "@/components/TrustedBySection";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <TrustedBySection />
      <AboutSection />
      <HowItWorksSection />
      <SolutionsSection />
      <PartnerSection />
      <BlogSection />
      <ContactSection />
      <Footer />
    </>
  );
}
