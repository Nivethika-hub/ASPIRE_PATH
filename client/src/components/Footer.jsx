import logo from '../logo_aspirepath.jpeg';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-blue-100 text-blue-900 py-10 mt-12 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-3">
          <img src={logo} alt="AspirePath Logo" className="w-10 h-10 rounded-lg shadow-sm" />
          <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
            AspirePath
          </p>
        </div>
        <p className="text-sm font-medium text-blue-500/80 max-w-sm">
          Discover Hackathons, Internships, and Job Opportunities
        </p>
        <p className="text-xs text-blue-400 mt-6 font-medium">
          © 2024 AspirePath. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
