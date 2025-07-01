import { useState } from "react";
import Navigation from "@/components/Navigation";
import Visualize from "./Visualize";
import Community from "./Community";
import Debug from "./Debug";

export default function Home() {
  const [activeSection, setActiveSection] = useState("visualize");

  const renderSection = () => {
    switch (activeSection) {
      case "visualize":
        return <Visualize />;
      case "community":
        return <Community />;
      case "debug":
        return <Debug />;
      default:
        return <Visualize />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderSection()}
      </main>
    </div>
  );
}
