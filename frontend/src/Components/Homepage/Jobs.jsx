import React, { useState, useEffect } from 'react';
import axios from "../LoginSignUp/axios.js";
import { NavLink } from 'react-router-dom';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Loader2, AlertTriangle, Briefcase, FilterX, Mail } from 'lucide-react';

const HeroBackgroundImage = "https://images.unsplash.com/photo-1550525811-e5869dd03032?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const FeatureImage1 = "https://img.freepik.com/free-vector/website-development-programmer-engineering-concept_335657-2838.jpg?w=2000";
const FeatureImage2 = "https://img.freepik.com/free-vector/marketing-strategy-concept_52683-34899.jpg?w=2000";
const FeatureImage3 = "https://img.freepik.com/free-vector/data-analysis-concept-illustration_114360-5242.jpg?w=2000";
const NewsletterImage = "https://images.unsplash.com/photo-1547394765-185e1e68f34e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const Jobs = () => {
    const [jobArray, setJobArray] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterCategory, setFilterCategory] = useState('');
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [subscriptionMessage, setSubscriptionMessage] = useState('');

    useEffect(() => {
        setLoading(true);
        axios.get("http://localhost:8080/jobs/getall")
            .then((res) => {
                setJobArray(res.data.Jobs || []);
            })
            .catch((err) => {
                console.error("Error fetching jobs:", err);
                setError("Failed to load job listings. Please try refreshing.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleCategoryClick = (category) => {
        setFilterCategory(category === filterCategory ? '' : category);
    };

    const filteredJobs = jobArray.filter(job => {
        if (!filterCategory) {
            return true;
        }
        const positionLower = job.position.toLowerCase();
        const categoryLower = filterCategory.toLowerCase();

        if (categoryLower === 'software developer') {
            return positionLower.includes('software') || positionLower.includes('developer');
        } else if (categoryLower === 'marketing and sales') {
            return positionLower.includes('marketing') || positionLower.includes('sales');
        } else if (categoryLower === 'data analyst and science') {
            return positionLower.includes('data') || positionLower.includes('analyst') || positionLower.includes('science');
        }
        return false;
    });

    const handleEmailChange = (event) => {
        setNewsletterEmail(event.target.value);
        setSubscriptionMessage('');
    };

    const subscribeNewsletter = (event) => {
        event.preventDefault();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newsletterEmail)) {
            setSubscriptionMessage(<p className="text-red-600 text-sm mt-2">Please enter a valid email address.</p>);
            return;
        }
        setSubscriptionMessage(<p className="text-green-700 text-sm mt-2 font-medium">Thank you for subscribing!</p>);
        setNewsletterEmail('');
    };

    const CategoryCard = ({ image, title, description, category }) => (
        <div
            onClick={() => handleCategoryClick(category)}
            className={`bg-white rounded-xl shadow-md border transition-all duration-300 cursor-pointer overflow-hidden ${
                filterCategory === category
                    ? 'border-orange-500 ring-2 ring-orange-200 shadow-lg'
                    : 'border-stone-200 hover:shadow-lg hover:border-orange-300'
            }`}
        >
            <img src={image} alt={title} className="w-full h-40 sm:h-48 object-cover" />
            <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
            </div>
        </div>
    );

    const JobCard = ({ job }) => (
        <div className="bg-white rounded-xl shadow-md border border-stone-200 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full overflow-hidden">
            <div className="p-5 flex-grow">
                <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-10 h-10 border-2 border-stone-100">
                        <AvatarImage src={job.logo || '/placeholder-logo.png'} alt={`${job.company} logo`} onError={(e) => e.target.src='/placeholder-logo.png'}/>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-base text-gray-800">{job.company}</h3>
                        <p className="text-xs text-gray-500">{job.location}</p>
                    </div>
                </div>
                <h2 className="font-bold text-lg text-gray-900 mb-2 leading-tight">
                    {job.position.length > 50 ? `${job.position.substring(0, 50)}…` : job.position}
                </h2>
                <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {job.description}
                </p>
            </div>
            <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex flex-wrap gap-2">
                    <Badge className="bg-amber-100 text-amber-800 border-amber-200 font-medium px-2 py-0.5 text-xs">
                        {job.batch} batch
                    </Badge>
                    <Badge className="bg-orange-100 text-orange-800 border-orange-200 font-medium px-2 py-0.5 text-xs">
                        ₹{job?.salary || 'N/A'} LPA
                    </Badge>
                </div>
                <NavLink
                    to={`/description/${job._id}`}
                    className="inline-block bg-orange-600 text-white font-medium py-1.5 px-4 rounded-lg hover:bg-orange-700 transition-colors text-xs shadow-sm whitespace-nowrap"
                >
                    View Details
                </NavLink>
            </div>
        </div>
    );

    return (
        <div className="bg-stone-100 min-h-screen font-sans">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 md:pt-24 md:pb-20 shadow-md overflow-hidden"
                style={{ backgroundImage: `url('${HeroBackgroundImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            >
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-orange-500 to-amber-500 opacity-80"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center text-center md:text-left">
                    <div className="md:w-3/5 lg:w-1/2 mb-8 md:mb-0">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight text-white">Discover Your Next Great Opportunity</h1>
                        <p className="text-base md:text-lg text-orange-100 mb-6">Explore job openings from leading companies. Find the perfect role matching your skills and aspirations.</p>
                        {/* Optional CTA button */}
                        {/* <NavLink to="/all-jobs" className="bg-white text-orange-600 font-semibold py-2.5 px-6 rounded-full hover:bg-orange-50 transition-colors shadow">Explore All Jobs</NavLink> */}
                    </div>
                    {/* Removed the image tag */}
                </div>
            </section>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto py-10 sm:py-12 px-4 sm:px-6 lg:px-8">

                {/* Featured Job Categories */}
                <section className="mb-12 md:mb-16">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Explore Job Categories</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        <CategoryCard image={FeatureImage1} title="Software Developer" description="Build innovative software solutions." category="software developer" />
                        <CategoryCard image={FeatureImage2} title="Marketing and Sales" description="Drive business growth." category="marketing and sales" />
                        <CategoryCard image={FeatureImage3} title="Data Analyst and Science" description="Unlock insights with data and science." category="data analyst and science" />

                        {filterCategory && (
                            <div className="sm:col-span-2 lg:col-span-3 text-center pt-4">
                                <button onClick={() => setFilterCategory('')} className="text-orange-600 hover:text-orange-800 font-semibold text-sm inline-flex items-center gap-1 group transition">
                                    <FilterX size={16} /> View All Categories
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* Job Listings Section */}
                <section className="mb-12 md:mb-16">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        {filterCategory ? `Jobs matching "${filterCategory}"` : 'Latest Job Openings'}
                    </h2>
                    {loading ? (
                        <div className="flex justify-center items-center py-16 text-orange-600">
                            <Loader2 className="w-10 h-10 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="text-center py-10 bg-red-50 text-red-700 rounded-lg p-4 border border-red-200 flex flex-col items-center gap-2">
                            <AlertTriangle className="w-8 h-8 text-red-500"/>
                            <p>{error}</p>
                        </div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="text-center py-10 bg-stone-50 text-gray-600 rounded-lg p-6 border border-stone-200 flex flex-col items-center gap-3">
                            <Briefcase className="w-10 h-10 text-stone-400"/>
                            <span className="text-lg">No jobs found {filterCategory ? `matching "${filterCategory}"` : ''}.</span>
                            {filterCategory && (
                                <button onClick={() => setFilterCategory('')} className="text-orange-600 hover:text-orange-800 font-semibold text-sm inline-flex items-center gap-1 group transition">
                                    <FilterX size={16} /> View All Jobs
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {filteredJobs.map((item) => (
                                <JobCard key={item._id} job={item} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Call to Action Section */}
                <section className="bg-gradient-to-r from-amber-100 to-orange-100 py-12 sm:py-16 rounded-xl shadow-sm border border-orange-200">
                    <div className="max-w-4xl mx-auto text-center px-4">
                        <h2 className="text-2xl md:text-3xl font-bold text-orange-800 mb-4">Ready to Find Your Dream Job?</h2>
                        <p className="text-base md:text-lg text-gray-700 mb-8">Sign up for alerts to get the latest opportunities relevant to you.</p>
                        <NavLink
                            to="/alerts"
                            className="inline-block bg-orange-600 text-white font-semibold py-2.5 px-6 rounded-full hover:bg-orange-700 transition-colors shadow-md"
                        >
                            Sign Up for Job Alerts
                        </NavLink>
                    </div>
                </section>

                {/* Newsletter Signup */}
                <section className="mt-12 md:mt-16 bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                        <div className="p-6 sm:p-8 order-2 md:order-1">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
                                <Mail size={22} className="text-orange-600"/> Subscribe to Our Newsletter
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">Get career advice &amp; job updates delivered to your inbox.</p>
                            <form onSubmit={subscribeNewsletter} className="mt-2 space-y-3">
                                <div>
                                    <label htmlFor="newsletterEmail" className="sr-only">Email Address</label>
                                    <input
                                        id="newsletterEmail"
                                        type="email"
                                        placeholder="Your Email Address"
                                        className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm transition shadow-sm"
                                        value={newsletterEmail}
                                        onChange={handleEmailChange}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto bg-orange-600 text-white font-medium py-2 px-5 rounded-lg hover:bg-orange-700 transition-colors text-sm shadow-sm"
                                >
                                    Subscribe
                                </button>
                                {subscriptionMessage && <div className="text-sm pt-1">{subscriptionMessage}</div>}
                            </form>
                        </div>
                        <div className="order-1 md:order-2 h-48 md:h-full">
                            <img src={NewsletterImage} alt="Newsletter Subscription" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 py-8 mt-10 md:mt-16 text-center text-gray-400 text-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="mb-2">&copy; {new Date().getFullYear()} Placement Connect Portal. All rights reserved.</p>
                    <div className="space-x-4">
                        <NavLink to="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</NavLink>
                        <span>|</span>
                        <NavLink to="/terms" className="hover:text-orange-400 transition-colors">Terms of Service</NavLink>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Jobs;