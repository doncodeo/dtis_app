// src/components/layout/Footer.tsx

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 md:p-8 mt-12 rounded-t-xl shadow-inner">
      <div className="container mx-auto text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Digital Threat Intelligence System. All rights reserved.</p>
        <p className="mt-2 text-gray-400">
          Enhancing cybersecurity through crowd-sourced intelligence.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
