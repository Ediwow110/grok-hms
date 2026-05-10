import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-md fixed w-full z-50">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">G</span>
            </div>
            <div>
              <div className="font-semibold text-xl tracking-tight">Grok HMS</div>
              <div className="text-[10px] text-gray-500 -mt-1">WORLD-CLASS HEALTHCARE PLATFORM</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
              Sign in
            </Link>
            <Link href="/register" className="btn-primary text-sm px-5 py-2">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-16 flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-primary to-slate-900 text-white">
        <div className="max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/10 text-sm mb-6">
            Built to Blueprint v2.0 • Phase 0 Foundation Complete
          </div>

          <h1 className="text-6xl font-semibold tracking-tighter mb-6">
            The most secure<br />hospital management system
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-white/80 mb-10">
            Workflow-first. Audit-first. Permission-first. Tenant-safe.<br />
            Every action traceable. Every record protected. Production-ready from day one.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-primary px-8 py-4 text-lg flex items-center justify-center gap-3 group">
              Start 30-day pilot
              <span className="group-hover:translate-x-0.5 transition">→</span>
            </Link>
            <Link href="#features" className="px-8 py-4 text-lg border border-white/30 hover:bg-white/10 rounded-xl transition">
              Watch demo
            </Link>
          </div>

          <div className="mt-16 text-xs text-white/50">
            Trusted by leading diagnostic centers • HIPAA-ready • SOC 2 aligned
          </div>
        </div>
      </div>

      <div id="features" className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
        {[ 
          { title: "Immutable Audit Trail", desc: "Every clinical, financial, and administrative action is logged with before/after state, reason, IP, and actor." },
          { title: "Granular Permissions", desc: "50+ named permissions with tenant, branch, department, and assignment scoping. Fail-closed by design." },
          { title: "Zero Trust Architecture", desc: "No shared accounts. MFA-ready. Cross-tenant leakage impossible. Released lab results are immutable." }
        ].map((f, i) => (
          <div key={i} className="card">
            <div className="text-primary text-4xl mb-4">{i === 0 ? '📜' : i === 1 ? '🔐' : '🛡️'}</div>
            <h3 className="font-semibold text-xl mb-3">{f.title}</h3>
            <p className="text-gray-600 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <footer className="border-t py-12 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Grok HMS • Built exactly to the World-Class Hospital Management System Blueprint v2.0
      </footer>
    </div>
  )
}