import { motion } from 'framer-motion';
import { Home, ChevronRight, GraduationCap, BookOpen, Award } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="bg-white min-h-screen">
            {/* Header Section */}
            <div className="relative h-96 bg-slate-900 overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="/college_building.png"
                        alt="College Building"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/70" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center">
                    <div className="border-l-4 border-indigo-500 pl-6">
                        <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight uppercase">About Us</h1>
                    </div>
                </div>
            </div>

            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center text-sm text-gray-500">
                        <a href="/" className="flex items-center hover:text-indigo-600 transition-colors">
                            <Home className="w-4 h-4 mr-2" />
                            Home
                        </a>
                        <ChevronRight className="w-4 h-4 mx-2 text-gray-300" />
                        <span className="font-medium text-indigo-600">About Us</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Speciality Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-16"
                >
                    <h2 className="text-3xl font-bold text-slate-800 mb-8 uppercase tracking-wide">Our <span className="text-indigo-600">Speciality</span></h2>

                    <div className="prose prose-lg text-slate-600 max-w-none text-justify">
                        <p>
                            St. Peter's College of Engineering and Technology offers the <strong>students</strong> with advantageous <strong>atmosphere</strong> with state-of-the-art facilities, distinguished <strong>mentors</strong>, and pleasant educational <strong>environment</strong>. The <strong>institution</strong> provides the <strong>employability</strong> and communication skills for the <strong>development</strong> of students. It provides quality <strong>education</strong> in an environment of discipline. The focus is on shaping <strong>students</strong> to become self-disciplined, self-dependent and self-confident individuals. The College pulls <strong>out</strong> all <strong>the</strong> stops to mould the <strong>students'</strong> career in such a way that they excel in all fine distinction of life. The College's stand is not only on mere acquisition of course knowledge and its application but also on all-round personality development of the student and his value system. The infrastructure facilities have also been made to allow detailed learning ambience for the students. The full-fledged eco-friendly offers a quality environment to the students.
                        </p>
                    </div>
                </motion.div>

                {/* Transport Section with Image */}
                <div className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold text-slate-800 mb-6 uppercase tracking-wide">Transport <span className="text-indigo-600">Facilities</span></h2>
                        <p className="text-slate-600 text-lg leading-relaxed mb-6">
                            Our college provides a comprehensive network of transport facilities connecting various parts of Chennai to the campus. We ensure safe and comfortable commuting for our students and staff with our fleet of well-maintained buses.
                        </p>
                        <ul className="space-y-3">
                            {['GPS Tracking', 'Safety First', 'Wide Coverage'].map((item) => (
                                <li key={item} className="flex items-center text-slate-700">
                                    <span className="h-2 w-2 rounded-full bg-indigo-500 mr-3"></span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="rounded-2xl overflow-hidden shadow-xl"
                    >
                        <img
                            src="/college_bus.png"
                            alt="College Bus Fleet"
                            className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                    </motion.div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                    >
                        <div className="text-4xl font-bold text-indigo-600 mb-2">27</div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Years of Excellence</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                    >
                        <div className="text-4xl font-bold text-indigo-600 mb-2">50000</div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Students Graduated</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                    >
                        <div className="text-4xl font-bold text-indigo-600 mb-2">16</div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">UG & PG Programs</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-center p-6 bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
                    >
                        <div className="text-4xl font-bold text-indigo-600 mb-2">2500+</div>
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Students Placed</div>
                    </motion.div>
                </div>


                {/* Detailed Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {/* Location */}
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Location</h3>
                        <p className="text-slate-600">Avadi, Chennai, Tamil Nadu.</p>
                    </div>

                    {/* Approval */}
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
                            <Award className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Approval & Affiliation</h3>
                        <p className="text-slate-600">Approved by AICTE, New Delhi, and affiliated with Anna University, Chennai.</p>
                    </div>

                    {/* Accreditation */}
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
                            <Award className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Accreditation</h3>
                        <p className="text-slate-600">Accredited by NAAC with 'A+' grade and ISO 9001:2015 certified.</p>
                    </div>

                    {/* Academic Programs */}
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors md:col-span-2 lg:col-span-1">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Academic Programs</h3>
                        <p className="text-slate-600 mb-4">Offers various B.E./B.Tech courses, M.E./M.Tech, MBA, and MCA.</p>
                        <p className="text-sm text-slate-500">Departments include Civil Engineering, Computer Science, and specialized fields like AI & Data Science (established in 2023-24).</p>
                    </div>

                    {/* Infrastructure */}
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Infrastructure</h3>
                        <p className="text-slate-600">The campus spans 12.38 acres and includes amenities like hostels, a library, and sports facilities.</p>
                    </div>

                    {/* Placement */}
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
                            <GraduationCap className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Placement & Training</h3>
                        <p className="text-slate-600">Focuses on employability through technical and soft skill training, helping students secure "super dream jobs".</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutUs;
