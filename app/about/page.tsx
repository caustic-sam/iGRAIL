import { PageHero } from '@/components/PageHero';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="About iGRAIL"
        subtitle="Your trusted source for global digital policy analysis and insights."
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              iGRAIL provides comprehensive coverage and expert analysis of digital policy developments worldwide.
              We help policymakers, legal professionals, and business leaders navigate the complex landscape of digital governance.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Do</h2>
            <ul className="space-y-3 text-lg text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Track and analyze digital policy developments globally</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Provide expert commentary and insights</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Offer policy templates and frameworks</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Connect policy professionals worldwide</span>
              </li>
            </ul>
          </section>

          <section className="bg-white rounded-lg p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-lg text-gray-600">
              For inquiries, please reach out to us at{' '}
              <a href="mailto:contact@worldpapers.com" className="text-blue-600 hover:text-blue-700 font-medium underline">
                contact@worldpapers.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
