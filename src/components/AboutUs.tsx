import React from 'react';
import Footer from "./Footer.tsx";
import instructor1 from '../assets/Instructors/sajith.png'
import instructor2 from '../assets/Instructors/chiran.png'
import instructor3 from '../assets/Instructors/wathsala.png'

// Placeholder team data (replace with actual team images and details)
const teamMembers = [
    {
        id: 1,
        name: "Mr.Sajith Gamage",
        role: "Founder & CEO",
        image: instructor1,
    },
    {
        id: 2,
        name: "Mr.Chiran Senanayaka",
        role: "Accedamic Manager",
        image: instructor2,
    },
    {
        id: 3,
        name: "Miss. Ruwanthi Wathsala",
        role: "Manager",
        image: instructor3,
    },
];

const AboutUs: React.FC = () => {
    return (
    <>
        <div className="bg-white flex flex-col items-center min-h-screen overflow-hidden relative top-36">
            <div className="w-full max-w-[1200px] px-6">
                {/* Mission Section */}
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-4 font-inter">Our Mission</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto font-inter">
                        At TBES, we are dedicated to empowering learners worldwide with accessible, high-quality education. Our mission is to provide innovative courses, expert instructors, and a supportive community to help you achieve your goals.
                    </p>
                </div>

                {/* Team Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center font-inter">Meet Our Team</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {teamMembers.map((member) => (
                            <div
                                key={member.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden text-center"
                            >
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="w-full h-[200px] object-cover"
                                />
                                <div className="p-4">
                                    <h3 className="text-xl font-semibold text-gray-800 font-inter">{member.name}</h3>
                                    <p className="text-gray-600 font-inter">{member.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center">
                    <p className="text-gray-600 mb-4 font-inter">
                        Ready to start your learning journey? Join us today!
                    </p>
                    <button className="bg-[#C9A500] text-white px-6 py-3 rounded-md hover:bg-[#A78A00] transition-colors font-inter">
                        Explore Courses
                    </button>
                </div>
            </div>
        </div>
        <div className="relative top-[200px]">
            <Footer />
        </div>
    </>
    );
};

export default AboutUs;