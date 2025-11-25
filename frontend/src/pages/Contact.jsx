import React from 'react'
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react'

const contactDetails = {
  email: 'support@quantumrisefoundation.org', // TODO: replace with your contact email
  phone: '+1 (555) 123-4567', // TODO: replace with your phone/WhatsApp number
  location: 'Add your office/location here',
  hours: 'Monday - Friday · 9:00 AM - 6:00 PM (update to your timezone)',
}

// TODO: replace these placeholders with the real founder details
const founders = [
  {
    name: 'Founder One',
    title: 'Co-Founder',
    email: 'founder1@example.com',
    phone: '+1 (555) 000-0001',
  },
  {
    name: 'Founder Two',
    title: 'Co-Founder',
    email: 'founder2@example.com',
    phone: '+1 (555) 000-0002',
  },
  {
    name: 'Founder Three',
    title: 'Co-Founder',
    email: 'founder3@example.com',
    phone: '+1 (555) 000-0003',
  },
]

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')
    const email = formData.get('email')
    const topic = formData.get('topic')
    const message = formData.get('message')

    const subject = encodeURIComponent(`Contact: ${topic || 'General Inquiry'} from ${name}`)
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`)

    window.location.href = `mailto:${contactDetails.email}?subject=${subject}&body=${body}`
  }

  return (
    <div className="bg-slate-900 text-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800">
        <div className="absolute inset-0 opacity-30" aria-hidden="true">
          <div className="w-96 h-96 bg-blue-600/20 blur-3xl rounded-full -translate-x-20 -translate-y-24" />
          <div className="w-96 h-96 bg-purple-600/20 blur-3xl rounded-full translate-x-40 translate-y-20" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-16 md:py-20">
          <p className="text-sm uppercase tracking-[0.2em] text-blue-300 mb-4">Contact</p>
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-4">
            Let&apos;s build the next chapter of learning together.
          </h1>
          <p className="text-slate-300 max-w-2xl">
            Tell us about your goals, partnerships, or support needs. We&apos;ll respond quickly with the best next step.
          </p>
          <div className="mt-8 flex flex-wrap gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
              <Clock size={16} className="text-blue-300" />
              <span>{contactDetails.hours}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur">
              <MessageCircle size={16} className="text-blue-300" />
              <span>Average response: under 1 business day</span>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 md:py-16 grid lg:grid-cols-[1.1fr_0.9fr] gap-10">
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-blue-300 mb-2">Leadership</p>
            <h2 className="text-xl font-semibold mb-2">Meet the founders</h2>
            <p className="text-slate-300 text-sm mb-4">
              Reach out directly to any of us. We are hands-on with deployments, partnerships, and product decisions.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {founders.map((founder) => (
                <div
                  key={founder.email}
                  className="p-4 rounded-xl border border-white/10 bg-slate-900/60 flex flex-col gap-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{founder.name}</p>
                      <p className="text-sm text-slate-400">{founder.title}</p>
                    </div>
                  </div>
                  <div className="text-sm text-slate-300 space-y-1">
                    <a href={`mailto:${founder.email}`} className="flex items-center gap-2 hover:text-blue-300">
                      <Mail size={16} className="text-blue-300" />
                      <span>{founder.email}</span>
                    </a>
                    <a href={`tel:${founder.phone}`} className="flex items-center gap-2 hover:text-blue-300">
                      <Phone size={16} className="text-blue-300" />
                      <span>{founder.phone}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <ContactCard
              icon={<Mail size={20} />}
              label="Email"
              value={contactDetails.email}
              href={`mailto:${contactDetails.email}`}
              accent="from-blue-500/20 to-blue-500/0"
            />
            <ContactCard
              icon={<Phone size={20} />}
              label="Phone / WhatsApp"
              value={contactDetails.phone}
              href={`tel:${contactDetails.phone}`}
              accent="from-emerald-500/20 to-emerald-500/0"
            />
            <ContactCard
              icon={<MapPin size={20} />}
              label="Location"
              value={contactDetails.location}
              accent="from-purple-500/20 to-purple-500/0"
            />
            <ContactCard
              icon={<Clock size={20} />}
              label="Hours"
              value={contactDetails.hours}
              accent="from-amber-500/20 to-amber-500/0"
            />
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-3">Talk to a real human</h2>
            <p className="text-slate-300 text-sm mb-4">
              We are educators and engineers behind the Quantum Rise platform. Share as much context as you can so we can pair you with the right person.
            </p>
            <ul className="text-sm text-slate-300 space-y-2">
              <li>• Partnerships and deployments (schools, NGOs, community orgs)</li>
              <li>• Product questions or roadmap ideas</li>
              <li>• Support for existing learners and admins</li>
            </ul>
          </div>
        </div>

        <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-slate-800/70 shadow-2xl shadow-blue-900/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-blue-300 mb-1">Message us</p>
              <h3 className="text-2xl font-semibold">Start the conversation</h3>
            </div>
            <Send className="text-blue-400" size={24} />
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Name</label>
              <input
                name="name"
                type="text"
                required
                placeholder="Your name"
                className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Topic</label>
              <select
                name="topic"
                className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                defaultValue="General Inquiry"
              >
                <option>General Inquiry</option>
                <option>Partnerships / Deployment</option>
                <option>Support</option>
                <option>Product Feedback</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-300">Message</label>
              <textarea
                name="message"
                required
                rows="4"
                placeholder="Tell us how we can help..."
                className="w-full bg-slate-900/60 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 font-semibold hover:opacity-90 transition"
            >
              Send message
            </button>
            <p className="text-xs text-slate-400 text-center">
              This form will open your email client. For a direct email, write to {contactDetails.email}.
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}

function ContactCard({ icon, label, value, href, accent }) {
  const content = (
    <div className="relative p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${accent} pointer-events-none`} />
      <div className="relative flex items-start gap-3">
        <div className="p-2 rounded-lg bg-slate-900/70 border border-white/10 text-blue-300">
          {icon}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="text-sm mt-1 text-white">{value}</p>
        </div>
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} className="block hover:-translate-y-0.5 transition-transform duration-150">
        {content}
      </a>
    )
  }

  return content
}
