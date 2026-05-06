import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-32">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-2 mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-white/80 text-sm font-medium">Connecting students to opportunities</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-6xl sm:text-7xl font-extrabold text-white mb-6 leading-tight">
            Aspire<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Path</span>
          </h1>
          <p className="text-2xl sm:text-3xl font-semibold text-purple-200 mb-6">
            Your Gateway to Hackathons, Internships & Jobs
          </p>
          <p className="text-lg text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
            AspirePath empowers students to discover curated career opportunities, bookmark deadlines, and track their journey — all in one intelligent platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              type="button"
              className="group px-8 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white rounded-2xl font-semibold text-lg cursor-default select-none transition-all duration-300 hover:bg-white/15 hover:border-white/50"
              aria-label="Explore opportunities section"
            >
                Explore Opportunities
            </button>
            <button
              onClick={() => navigate('/register')}
              className="group px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-semibold text-lg shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300"
            >
                Get Started
            </button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
          {[
            {
              title: 'Hackathons',
              desc: 'Join exciting hackathons and showcase your skills to top companies and recruiters.',
              color: 'from-purple-500/20 to-purple-600/10'
            },
            {
              title: 'Internships',
              desc: 'Find internship opportunities tailored to your skills, interests, and career goals.',
              color: 'from-pink-500/20 to-pink-600/10'
            },
            {
              title: 'Jobs',
              desc: 'Explore full-time job openings from startups to Fortune 500 companies.',
              color: 'from-indigo-500/20 to-indigo-600/10'
            }
          ].map((feature) => (
            <div
              key={feature.title}
              className={`bg-gradient-to-br ${feature.color} backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/30 hover:scale-105 transition-all duration-300 cursor-default`}
            >
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex flex-col sm:flex-row justify-center gap-12 mt-20">
          {[
            { label: 'Opportunities Listed', value: '500+' },
            { label: 'Students Registered', value: '2,000+' },
            { label: 'Companies Partnered', value: '100+' }
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{stat.value}</div>
              <div className="text-white/60 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
