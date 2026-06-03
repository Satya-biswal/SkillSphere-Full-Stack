import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

const Landing = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      if (user.role === 'client') navigate('/client/dashboard');
      else if (user.role === 'freelancer') navigate('/freelancer/dashboard');
      else navigate('/admin/dashboard');
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-indigo-600">
          Skill<span className="text-gray-800">Sphere</span>
        </h1>
        <div className="flex gap-3">
          <button onClick={() => navigate('/login')}
            className="text-sm text-gray-600 hover:text-indigo-600 px-4 py-2 rounded-xl transition">
            Sign In
          </button>
          <button onClick={() => navigate('/register')}
            className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl transition">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 py-20 text-center">
        <div className="inline-block bg-indigo-50 text-indigo-600 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          🚀 Intelligent Hyperlocal Freelance Ecosystem
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Connect. Work.
          <span className="text-indigo-600"> Get Paid.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          SkillSphere connects clients with top local freelancers using AI-powered matching,
          secure payments, and real-time collaboration tools.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button onClick={() => navigate('/register')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-semibold transition text-lg">
            Start as Freelancer
          </button>
          <button onClick={() => navigate('/register')}
            className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3.5 rounded-xl font-semibold transition text-lg">
            Hire Talent
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16">
          {[
            { value: '500+', label: 'Freelancers' },
            { value: '1000+', label: 'Projects Done' },
            { value: '₹50L+', label: 'Paid Out' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold text-indigo-600">{s.value}</p>
              <p className="text-gray-400 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Everything You Need</h2>
            <p className="text-gray-500 mt-3">Built with powerful features for both clients and freelancers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🤖', title: 'AI Job Matching', desc: 'Smart algorithm matches freelancers to projects based on skills, location and reputation score' },
              { icon: '💳', title: 'Secure Payments', desc: 'Razorpay powered escrow payments with milestone releases and automatic payouts' },
              { icon: '💬', title: 'Real-time Chat', desc: 'Instant messaging with typing indicators, file sharing and read receipts via Socket.IO' },
              { icon: '⭐', title: 'Reputation System', desc: 'Weighted review scores with fraud detection to ensure only genuine feedback' },
              { icon: '📊', title: 'Analytics Dashboard', desc: 'Track earnings, proposal success rates, and project completion metrics' },
              { icon: '⚖️', title: 'Dispute Resolution', desc: 'Admin mediated dispute system with evidence upload and fair resolution' },
            ].map((f) => (
              <div key={f.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl mb-4">
                  {f.icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">How It Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* For Clients */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                🏢 For Clients
              </h3>
              <div className="space-y-5">
                {[
                  { step: '01', title: 'Post a Gig', desc: 'Describe your project, set budget and required skills' },
                  { step: '02', title: 'Review Proposals', desc: 'AI ranks best matching freelancers for your project' },
                  { step: '03', title: 'Collaborate', desc: 'Chat, track progress and manage milestones in real-time' },
                  { step: '04', title: 'Pay Securely', desc: 'Release payments on milestone completion via escrow' },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{s.title}</p>
                      <p className="text-gray-400 text-sm mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Freelancers */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                💼 For Freelancers
              </h3>
              <div className="space-y-5">
                {[
                  { step: '01', title: 'Build Your Profile', desc: 'Add skills, portfolio, experience and certifications' },
                  { step: '02', title: 'Browse & Apply', desc: 'Find matching gigs and submit competitive proposals' },
                  { step: '03', title: 'Deliver Work', desc: 'Track milestones, chat with clients, upload deliverables' },
                  { step: '04', title: 'Get Paid', desc: 'Receive secure payments directly to your account' },
                ].map((s) => (
                  <div key={s.step} className="flex gap-4">
                    <div className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {s.step}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{s.title}</p>
                      <p className="text-gray-400 text-sm mt-0.5">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">Built With Modern Tech</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'React.js', 'Node.js', 'Express.js', 'MongoDB',
              'Socket.IO', 'Redux Toolkit', 'Tailwind CSS',
              'Razorpay', 'JWT Auth', 'Cloudinary'
            ].map((tech) => (
              <span key={tech}
                className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium shadow-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-20">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-indigo-200 text-lg mb-8">
            Join SkillSphere today and connect with top talent or find your next project
          </p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/register')}
              className="bg-white text-indigo-600 hover:bg-indigo-50 px-8 py-3.5 rounded-xl font-semibold transition">
              Create Free Account
            </button>
            <button onClick={() => navigate('/login')}
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-3.5 rounded-xl font-semibold transition">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p className="text-sm">
          © 2026 SkillSphere — Built for Nayoda Full Stack Internship
        </p>
        <p className="text-xs mt-1 text-gray-600">
          MERN Stack · Socket.IO · Razorpay · JWT Auth
        </p>
      </footer>
    </div>
  );
};

export default Landing;