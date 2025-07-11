import React from 'react';
import BackgroundBall from "../assets/background_ball.png";
const features = [
    {
        id: 1,
        title: "Interactive Courses",
        description: "Engage with hands-on lessons designed to keep you motivated.",
        icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 xs:w-8 xs:h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#C9A500]">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
            </svg>),
    },
    {
        id: 2,
        title: "Expert Instructors",
        description: "Learn from industry leaders with years of experience.",
        icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 xs:w-8 xs:h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#C9A500]">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
            </svg>),
    },
    {
        id: 3,
        title: "Flexible Learning",
        description: "Study at your own pace, anytime, anywhere.",
        icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 xs:w-8 xs:h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#C9A500]">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
            </svg>),
    },
    {
        id: 4,
        title: "Certification",
        description: "Earn certificates to showcase your achievements.",
        icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 xs:w-8 xs:h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#C9A500]">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
            </svg>),
    },
    {
        id: 5,
        title: "Community Support",
        description: "Join a vibrant community of learners for support.",
        icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 xs:w-8 xs:h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#C9A500]">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
            </svg>),
    },
    {
        id: 6,
        title: "Progress Tracking",
        description: "Monitor your learning journey with detailed analytics.",
        icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 xs:w-8 xs:h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-[#C9A500]">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
            </svg>),
    },
];
const Features = () => {
    return (<div className="relative bg-[#1B61EF]/10 flex items-center justify-center py-8 xs:py-10 sm:py-12 md:py-16 min-h-[80vh] lg:h-[610px] xs:min-h-[85vh]  sm:min-h-screen overflow-hidden">
            {/* Background Image */}
            <img src={BackgroundBall} alt="Background decorative ball" className="absolute top-[-10%] right-[0%] w-[1400px] xs:w-0 sm:w-[400px] md:w-[600px] lg:w-[1040px] lg:h-[680px] xl:w-[1550px] xl:h-auto xl:top-0 z-0 opacity-50 xs:opacity-50 sm:opacity-70 lg:opacity-100 pointer-events-none select-none"/>

            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col xs:flex-col sm:flex-row w-full max-w-[90vw] xs:max-w-[92vw] sm:max-w-[1200px] lg:max-w-[1400px] px-3 xs:px-4 sm:px-6 md:px-8">
                {/* Title Section */}
                <div className="w-full xs:w-full sm:w-2/5 flex items-center justify-start mb-6 xs:mb-8 sm:mb-0">
                    <h1 className="text-[24px] xs:text-[28px] sm:text-[36px] md:text-[44px] lg:text-[50px] font-bold bg-gradient-to-r from-[#364CE2] via-[#283BBE] to-[#010D60] text-transparent bg-clip-text leading-tight font-inter text-left relative left-0 xs:left-0 sm:left-6 lg:left-10">
                        Features
                    </h1>
                </div>

                {/* Features Grid */}
                <div className=" relative w-full xs:w-full sm:w-3/5 grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-4 sm:gap-6 ">
                    {features.map((feature) => (<div key={feature.id} className="bg-[white]/40 backdrop-blur-[8px] xs:backdrop-blur-[10px] border border-white/20 rounded-xl shadow-md p-4 xs:p-4 sm:p-5 md:p-6 lg:h-[170px] flex flex-col items-center text-center transition-all duration-300">
                            <div className=" relative mb-3 xs:mb-4 lg:bottom-2">{feature.icon}</div>
                            <h3 className=" relative text-lg xs:text-lg sm:text-xl font-semibold text-gray-800 mb-2 font-inter lg:bottom-3 lg:text-[18px]">
                                {feature.title}
                            </h3>
                            <p className=" relative text-sm xs:text-sm sm:text-base text-black font-inter lg:bottom-3">
                                {feature.description}
                            </p>
                        </div>))}
                </div>
            </div>
        </div>);
};
export default Features;
