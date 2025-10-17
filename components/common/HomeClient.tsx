import React from "react";
import FeaturesSection from "./FeaturesSection";
import CTASection from "./CTASection";
import HeroSection from "./HeroSection";
import Header from "../header";
import Footer from "../footer";

function homeClient() {
  return (
    <>
      <Header />
      <div className="min-h-screen">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </div>
      <Footer />
    </>
  );
}

export default homeClient;
