import React, { useState } from 'react'; // Import useState
import { Link } from 'react-router-dom';
import { FaArrowRight, FaBuilding, FaCalendarCheck, FaChartPie, FaGraduationCap, FaLightbulb, FaQuoteLeft, FaSearch, FaUserCheck, FaUsers, FaUserCircle, // Added for Avatar
 FaSignInAlt, FaUserPlus, FaSignOutAlt 
} from 'react-icons/fa';




const NavLink = ({ to, children }) => (
   <Link
      to={to}
      className="text-gray-600 hover:text-orange-600 inline-flex items-center px-1 pt-1 text-sm font-medium transition"
   >
      {children}
   </Link>
);


const FeatureCard = ({ icon, title, description, link, linkText }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
    <div className="flex items-center justify-center h-12 w-12 mb-4 bg-orange-100 text-orange-600 rounded-full">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed mb-4">{description}</p>
    {link && linkText && (
      <Link to={link} className="text-sm font-semibold text-orange-600 hover:text-orange-800 transition group">
        {linkText} <FaArrowRight className="inline-block ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
      </Link>
    )}
  </div>
);


const TestimonialCard = ({ quote, name, position, image }) => (
   <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-lg shadow-sm relative border border-orange-100">
      <FaQuoteLeft className="text-orange-200 text-4xl absolute top-4 left-4 opacity-80 -z-0" />
      <p className="text-gray-700 italic relative z-10 mb-4">"{quote}"</p>
      <div className="flex items-center gap-3">
         {image && <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover" />}
         <div>
            <p className="font-semibold text-gray-800 text-sm">{name}</p>
            <p className="text-xs text-gray-500">{position}</p>
         </div>
      </div>
   </div>
);

const Homepage = () => {
  const collegeName = "GL BAJAJ"; 
  const heroHeadline = "Shape Your Future Today";
  const heroSubtext = `Discover exciting career opportunities through ${collegeName}'s dedicated placement portal. Connect with top companies, access resources, and launch your professional journey.`;
  const companiesLink = "/companies";
  const jobsLink = "/jobs";
  const eventsLink = "/events";
  const resourcesLink = "/resources";
  const studentRegLink = "/jobs"; 
  const recruiterRegLink = "/register/recruiter"; 
  const collegeAboutLink = "https://www.glbitm.org/"; 
  const statsLink = "/placement-stats"; 

  const placementRate = "94%";
  const highestPackage = "₹ 45 LPA";
  const companiesVisited = "300+";

 
  const testimonials = [
     { quote: "The placement cell was incredibly supportive. I landed my dream job at a top tech company!", name: "Priya Sharma", position: "Software Engineer @ TechCorp", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format=fit&w=60&q=80" }, // Replace image
     { quote: "The workshops and mock interviews prepared me well. The process was smooth and transparent.", name: "Amit Singh", position: "Marketing Analyst @ MarketPro", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format=fit&w=60&q=80" }, // Replace image
  ];

  
   const companyLogos = [
      "https://logo.clearbit.com/google.com",
      "https://logo.clearbit.com/microsoft.com",
      "https://logo.clearbit.com/deloitte.com",
      "https://logo.clearbit.com/amazon.com",
      "https://logo.clearbit.com/infosys.com",
      "https://logo.clearbit.com/tcs.com"
   ];


  return (
    <div className="bg-stone-50 min-h-screen font-sans">

      <section className="relative pt-20 pb-24 md:pt-28 md:pb-36 text-center overflow-hidden bg-gradient-to-b from-orange-100 via-stone-50 to-stone-50">
         <img
             src="https://images.unsplash.com/photo-1557682250-33bd709cbe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
             alt=""
             className="absolute inset-0 w-full h-full object-cover opacity-10"
         />
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"> {/* Applied wider container */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-4">
            {heroHeadline}
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto"> {/* Keep text line length readable */}
            {heroSubtext}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={jobsLink}
                className="inline-block bg-orange-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-orange-700 transition duration-300 transform hover:scale-105 shadow-md"
              >
                 <FaSearch className="inline-block mr-2" /> Explore Job Openings
              </Link>
               {/* <Link
                to={eventsLink}
                className="inline-block bg-white text-orange-600 py-3 px-8 rounded-full font-semibold hover:bg-gray-50 transition duration-300 transform hover:scale-105 shadow-md border border-orange-200"
              >
                 <FaCalendarCheck className="inline-block mr-2" /> View Upcoming Events
              </Link> */}
          </div>
        </div>
      </section>

      {/* --- Quick Stats Section --- */}
      <section className="py-12 bg-white -mt-12 relative z-20 rounded-t-xl shadow-lg">
         {/* Apply wider container */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                    <p className="text-4xl font-bold text-orange-600 mb-1">{placementRate}</p>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Placement Rate</p>
                </div>
                 <div>
                    <p className="text-4xl font-bold text-orange-600 mb-1">{highestPackage}</p>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Highest Package</p>
                </div>
                 <div>
                    <p className="text-4xl font-bold text-orange-600 mb-1">{companiesVisited}</p>
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Companies Visited (Last Year)</p>
                </div>
            </div>
        </div>
      </section>

      {/* --- Key Features Section --- */}
      <section className="py-16 md:py-24 bg-stone-100">
         {/* Apply wider container */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Your Placement Toolkit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* Feature Cards */}
             <FeatureCard
                icon={<FaSearch size={24} />}
                title="Discover Opportunities"
                description="Browse job listings from diverse industries tailored to your profile and preferences."
                link={jobsLink}
                linkText="Find Jobs"
             />
              <FeatureCard
                icon={<FaLightbulb size={24} />}
                title="Skill Enhancement"
                description="Access workshops, webinars, and resources designed to boost your employability."
                link={resourcesLink}
                linkText="Access Resources"
             />
              <FeatureCard
                icon={<FaUserCheck size={24} />}
                title="Connect & Apply"
                description="Easily apply to companies, track your applications, and manage interview schedules."
                link={studentRegLink} // Link to student portal/login
                linkText="Go to Portal"
             />
          </div>
        </div>
      </section>

       {/* --- Featured Companies --- */}
      <section className="py-16 md:py-24 bg-white">
        {/* Apply wider container */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Connecting You With Leaders</h2>
          <p className="text-gray-600 mb-12 max-w-xl mx-auto">We partner with a wide range of companies, from global giants to innovative startups.</p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 md:gap-x-12">
             {companyLogos.map((logoUrl, index) => (
                <div key={index} className="h-10 flex items-center justify-center filter grayscale hover:grayscale-0 transition duration-300 opacity-70 hover:opacity-100">
                    <img src={logoUrl} alt={`Company Logo ${index + 1}`} className="max-h-full" />
                </div>
             ))}
             {/* Add more logos */}
          </div>
           <div className="mt-12">
             {/* <Link to={companiesLink} className="text-sm font-semibold text-orange-600 hover:text-orange-800 transition group">
                & Many more.. <FaArrowRight className="inline-block ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
             </Link> */}
           </div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
         {/* Apply wider container, but keep text constrained for readability */}
         <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Success Stories</h2>
            {/* Max-width on the grid itself keeps testimonials readable */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
               {testimonials.map((testimonial, index) => (
                  <TestimonialCard key={index} {...testimonial} />
               ))}
            </div>
         </div>
      </section>

      {/* --- Call to Action Section --- */}
       <section className="py-16 md:py-20 bg-orange-600 text-white">
        {/* Apply wider container */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take the Next Step?</h2>
          <p className="text-orange-100 mb-8 max-w-xl mx-auto">
             Join the {collegeName} placement process or partner with us to find exceptional talent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
          
             {/* <Link
               to={studentRegLink}
               className="inline-block bg-white text-orange-700 py-3 px-8 rounded-full font-semibold hover:bg-gray-100 transition duration-300 transform hover:scale-105 shadow"
             >
                <FaUsers className="inline-block mr-2" /> For Students
             </Link>
              
             <Link
               to={recruiterRegLink}
               className="inline-block bg-orange-800 text-white py-3 px-8 rounded-full font-semibold hover:bg-orange-900 transition duration-300 transform hover:scale-105 shadow border border-orange-500"
             >
                <FaBuilding className="inline-block mr-2" /> For Admins
             </Link> */}
          </div>
        </div>
      </section>


      <footer className="bg-stone-800 py-8 text-center text-stone-400">
        {/* Apply wider container */}
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
              {/* Footer Links Example */}
              <Link to={collegeAboutLink} target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition mx-2">About {collegeName}</Link>
              <Link to="/contact" className="text-sm hover:text-white transition mx-2">Contact Placement Cell</Link>
              <Link to={statsLink} className="text-sm hover:text-white transition mx-2">Placement Statistics</Link>
          </div>
          <p className="text-sm">&copy; {new Date().getFullYear()} {collegeName}. All Rights Reserved.</p>
          <div className="mt-3 space-x-3 text-xs">
            <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
            <span>|</span>
            <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;