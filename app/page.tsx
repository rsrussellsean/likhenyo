import Header from '@/components/landing/Header'
import Hero from '@/components/landing/Hero'
import HowItWorks from '@/components/landing/HowItWorks'
import Categories from '@/components/landing/Categories'
import Features from '@/components/landing/Features'
import Testimonials from '@/components/landing/Testimonials'
import CTA from '@/components/landing/CTA'
import Footer from '@/components/landing/Footer'

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <Categories />
        <Features />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  )
}
