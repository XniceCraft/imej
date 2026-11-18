import { Content } from './_components/content'
import { Converter } from './_components/converter'
import { Hero } from './_components/hero'
import { Footer } from '@/components/footer/footer'
import { Navbar } from '@/components/navbar/navbar'

export function meta() {
  return [{ title: 'Imej' }, { name: 'description', content: 'Convert images in seconds' }]
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Converter />
        <Content />
        <Footer />
      </main>
    </>
  )
}
