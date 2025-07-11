import React, { useState, useEffect } from 'react';
import background from '../assets/Group 7.png';
import Features from "../components/Features.tsx";
import Testimonials from "../components/Testimonials";
import { ImageGallery } from "../components/ImageGallery.tsx";
import TopRatedCourses from "../components/TopRatedCourses.tsx";
import Footer from "../components/Footer.tsx";
import backsquare from "../assets/square.png";
import reviewer1 from '../assets/7074311_3551739.jpg';
import reviewer2 from '../assets/avatar6.jpg';
import reviewer3 from '../assets/avatar4.jpg';
import reviewer4 from '../assets/avatar5.jpg';
import reviewer5 from '../assets/7074313_3551911.jpg';
import reviewer6 from '../assets/370751043_e67eb556-f125-4e24-95ad-8aff21b9926a.jpg';
const reviewerImages = [
    reviewer1,
    reviewer2,
    reviewer3,
    reviewer4,
    reviewer5,
    reviewer6,
];
const Home = () => {
    const [currentImages, setCurrentImages] = useState([
        reviewerImages[0],
        reviewerImages[1],
        reviewerImages[2],
        reviewerImages[3],
    ]);
    const getRandomImage = (exclude) => {
        const availableImages = reviewerImages.filter(img => !exclude.includes(img));
        return availableImages[Math.floor(Math.random() * availableImages.length)] || availableImages[0];
    };
    useEffect(() => {
        const intervals = [30000, 32000, 34000, 36000];
        const timers = [];
        currentImages.forEach((_, index) => {
            const changeImage = () => {
                setCurrentImages(prev => {
                    const newImages = [...prev];
                    newImages[index] = getRandomImage(newImages);
                    return newImages;
                });
            };
            const initialDelay = Math.random() * 2000;
            timers.push(setTimeout(() => {
                changeImage();
                timers.push(setInterval(changeImage, intervals[index]));
            }, initialDelay));
        });
        return () => timers.forEach(clearInterval);
    }, []);
    return (<>
            <div className="w-full min-h-[100vh] bg-[#02051B] flex flex-col items-center justify-center overflow-hidden pt-16 sm:pt-20 md:pt-24">
                {/* Decorative Background Images */}
                <img src={background} alt="Decorative background pattern" className="absolute top-0 left-0 w-full max-w-[700px] pointer-events-none z-0 sm:right-[-10%] md:right-[10%] lg:right-[20%] xl:right-[25%] 2xl:right-[30%]"/>
                <img src={backsquare} alt="Decorative square pattern" className="w-full absolute top-0 opacity-5 z-10"/>


                {/* Gradient Bar with Reviewer Photos */}
                <div className="p-[2px] rounded-2xl bg-gradient-to-r from-transparent via-white to-transparent absolute top-[120px] xs:top-[120px] sm:top-[15%] md:top-[20%] lg:top-[20%] w-[75vw] max-w-[260px] xs:max-w-[280px] sm:max-w-[320px] lg:max-w-[350px] mx-auto">
                    <div className="h-6 xs:h-7 sm:h-8 lg:h-9 rounded-xl bg-[#02051B] flex items-center justify-center space-x-1 px-1 xs:px-2">
                        {currentImages.map((img, i) => (<img key={i} src={img} alt={`Reviewer ${i + 1} profile`} className="inline-block w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 rounded-full object-cover" style={{ boxShadow: 'inset 0 0 6px 2px rgba(255,255,255,0.3)' }}/>))}
                        <p className="text-white text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs lg:text-sm ml-1 xs:ml-2 p-1 font-inter">
                            Trusted by 20,000+ People
                        </p>
                    </div>
                </div>

                {/* Title and Paragraph */}
                <div className="flex flex-col items-start justify-center absolute top-[160px] xs:top-[180px] sm:top-[20%] md:top-[28%] lg:top-[35%] px-3 xs:px-3 sm:px-4 md:px-6 lg:px-8 w-full max-w-[90vw] xs:max-w-[92vw] sm:max-w-[90vw] md:max-w-[85vw] lg:max-w-[1200px] mx-auto mt-4 xs:mt-5 sm:mt-6 md:mt-8 lg:mt-10">
                    <h1 className="w-full max-w-full text-white text-center text-[24px] xs:text-[65px] sm:text-[32px] md:text-[48px] lg:text-[64px] xl:text-[78px] leading-[28px] xs:leading-[65px] sm:leading-[36px] md:leading-[52px] lg:leading-[68px] xl:leading-[80px] font-inter font-bold ">
                        Improve Your Skills to Boost Your Professional Path
                    </h1>
                    <p className="w-full max-w-full text-white text-center text-[11px] xs:text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px] font-inter mt-2 xs:mt-6 sm:mt-4 md:mt-5">
                        Provides you with the latest online learning system and material that help your knowledge growing.
                    </p>
                </div>
            </div>

            <div className="w-full">
                <Features />
            </div>

            <div className="w-full">
                <Testimonials />
            </div>

            <div className="w-full">
                <ImageGallery />
            </div>

            <div className="w-full">
                <TopRatedCourses />
            </div>

            <div className="w-full">
                <Footer />
            </div>
        </>);
};
export default Home;
