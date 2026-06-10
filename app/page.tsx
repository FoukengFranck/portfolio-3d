import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Portfolios from "@/components/Portfolios";
import Blog from "@/components/Blog";
import Contacts from "@/components/Contacts";

export default function Page() {
  return (
    <>
      <section id="home" className="min-h-screen">
        <Hero />
      </section>
      <section id="about" className="min-h-screen">
        <About />
      </section>
      <section id="skills" className="min-h-screen">
        <Skills />
      </section>
      <section id="portfolio" className="min-h-screen">
        <Portfolios />
      </section>
      <section id="blog" className="min-h-screen">
        <Blog />
      </section>
      <section id="contact" className="min-h-screen">
        <Contacts />
      </section>
    </>
  );
}
