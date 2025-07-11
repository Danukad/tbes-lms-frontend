import React, { useState } from 'react';
import Footer from "./Footer.tsx";
const ContactUs: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder for form submission logic (e.g., API call)
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <>
        <div className="bg-white flex flex-col items-center min-h-screen overflow-hidden relative top-36">
            <div className="w-full max-w-[1200px] px-6">
                {/* Contact Form */}
                <div className="mb-16">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center font-inter">Get in Touch</h2>
                    <div className="max-w-lg mx-auto">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-gray-800 font-inter mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-[#364CE2]"
                                    placeholder="Your Name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-800 font-inter mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-[#364CE2]"
                                    placeholder="Your Email"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-gray-800 font-inter mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg font-inter focus:outline-none focus:ring-2 focus:ring-[#364CE2]"
                                    placeholder="Your Message"
                                    rows={5}
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="bg-[#C9A500] text-white px-6 py-3 rounded-md hover:bg-[#A78A00] transition-colors font-inter w-full"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>

                {/* Contact Details */}
                <div className="mb-16">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center font-inter">Contact Information</h2>
                    <div className="max-w-lg mx-auto text-center text-gray-600 font-inter space-y-4">
                        <p>Email: thebritishenglishschool12@gmail.com</p>
                        <p>Phone: +94 71 235 7739</p>
                        <p>Address: Moonamaldeniya Kuliyapitiya</p>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center">
                    <p className="text-gray-600 mb-4 font-inter">
                        Want to learn more? Check out our courses!
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

export default ContactUs;