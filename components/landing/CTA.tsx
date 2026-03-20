import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CTA() {
  return (
    <section className="bg-background py-24">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 px-8 py-16">
          <h2 className="font-heading text-4xl text-foreground lg:text-5xl">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Join thousands of Filipino professionals and clients building real working
            relationships — structured, verified, and trusted.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-amber-500 px-10 text-white hover:bg-amber-600"
              asChild
            >
              <Link href="/signup?role=client">Post a Job</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#0c1828] px-10 text-[#0c1828] hover:bg-[#0c1828] hover:text-white"
              asChild
            >
              <Link href="/signup?role=freelancer">Find Work</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
