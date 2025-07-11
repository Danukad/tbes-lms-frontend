import React from 'react';
const Footer = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        // Placeholder for newsletter submission logic
        console.log('Newsletter subscription submitted');
    };
    return (<footer className="bg-[#010D60] text-white py-8 xs:py-8 sm:py-10 md:py-12 overflow-hidden">
            <div className="w-full max-w-[90vw] xs:max-w-[92vw] sm:max-w-[1000px] md:max-w-[1200px] mx-auto px-3 xs:px-3 sm:px-4 md:px-6 min-h-[auto] sm:min-h-[400px]">
                <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 xs:gap-4 sm:gap-6 md:gap-8">
                    {/* Company Info */}
                    <div className="mb-4 xs:mb-6 sm:mb-0">
                        <h3 className="text-xl xs:text-xl sm:text-2xl font-bold mb-3 xs:mb-4 font-inter">TBES</h3>
                        <p className="text-gray-200 text-sm xs:text-sm sm:text-base">
                            Transforming education with innovative online learning solutions. Join us to unlock your potential!
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg xs:text-lg sm:text-xl font-semibold mb-3 xs:mb-4 font-inter">Quick Links</h3>
                        <ul className="space-y-1.5 xs:space-y-2">
                            <li>
                                <a href="/courses" className="text-gray-400 hover:text-white hover:underline transition-all duration-300 text-sm xs:text-sm sm:text-base">
                                    Courses
                                </a>
                            </li>
                            <li>
                                <a href="/about" className="text-gray-400 hover:text-white hover:underline transition-all duration-300 text-sm xs:text-sm sm:text-base">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="/contact" className="text-gray-400 hover:text-white hover:underline transition-all duration-300 text-sm xs:text-sm sm:text-base">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h3 className="text-lg xs:text-lg sm:text-xl font-semibold mb-3 xs:mb-4 font-inter">Follow Us</h3>
                        <div className="flex space-x-3 xs:space-x-4">
                            <a href="https://facebook.com" className="text-gray-400 hover:text-[#4267B2] hover:scale-125 transition-all duration-300" aria-label="Facebook">
                                <svg className="w-5 h-5 xs:w-5 xs:h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.988h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                                </svg>
                            </a>
                            <a href="https://twitter.com" className="text-gray-400 hover:text-[#1DA1F2] hover:scale-125 transition-all duration-300" aria-label="Twitter">
                                <svg className="w-5 h-5 xs:w-5 xs:h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23 3a10.9 10.9 0 01-3.14 2.6 4.75 4.75 0 00-7.22 3.89c0 .35.04.69.13 1.02A13.45 13.45 0 011.2 3.6a4.82 4.82 0 001.5 6.42A4.72 4.72 0 013 9.8a4.79 4.79 0 01-2.18-.61v.06c0 2.34 1.66 4.29 3.86 4.73a4.76 4.76 0 01-2.16.08 4.8 4.8 0 004.47 3.33A9.53 9.53 0 010 19.54a13.58 13.58 0 007.35 2.16c8.82 0 13.65-7.31 13.65-13.65 0-.2-.01-.41-.03-.61A9.76 9.76 0 0023 3z"/>
                                </svg>
                            </a>
                            <a href="https://instagram.com" className="text-gray-400 hover:text-[#E1306C] hover:scale-125 transition-all duration-300" aria-label="Instagram">
                                <svg className="w-5 h-5 xs:w-5 xs:h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.233.308 2.686.646.52.355.853.752 1.024 1.46.157.641.234 1.351.234 2.077 0 .725-.077 1.436-.234 2.077-.171.708-.504 1.105-1.024 1.46-.453.338-1.32.584-2.686.646-.68.058-1.646.07-4.85.07s-4.17-.012-4.85-.07c-1.366-.062-2.233-.308-2.686-.646-.52-.355-.853-.752-1.024-1.46-.157-.641-.234-1.351-.234-2.077 0-.725.077-1.436.234-2.077.171-.708.504-1.105 1.024-1.46.453-.338 1.32-.584 2.686-.646.66-.059 1.615-.07 4.85-.07zm0-2.163c-3.259 0-3.67.014-4.95.072-1.315.062-2.597.297-3.799.654C2.23 1.007 1 1.7 0 2.823c-.972 1.08-1.621 2.5-1.831 4.014-.224 1.64-.252 2.049-.252 6.077s.028 4.437.252 6.077c.21 1.514.859 2.934 1.831 4.014 1.01 1.124 2.23 1.816 3.95 2.088 1.202.357 2.484.592 3.799.654 1.28.058 1.691.072 4.95.072s3.67-.014 4.95-.072c1.315-.062 2.597-.297 3.799-.654 1.72-.272 2.94-.964 3.95-2.088 1.014-1.083 1.621-2.5 1.831-4.014.224-1.64.252-2.049.252-6.077s-.028-4.437-.252-6.077c-.21-1.514-.859-2.934-1.831-4.014-1.01-1.124-2.23-1.816-3.95-2.088-1.202-.357-2.484-.592-3.799-.654-1.28-.058-1.691-.072-4.95-.072zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162S8.597 18.162 12 18.162 18.162 15.403 18.162 12 15.403 5.838 12 5.838zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Newsletter Signup */}
                    <div>
                        <h3 className="text-lg xs:text-lg sm:text-xl font-semibold mb-3 xs:mb-4 font-inter">Newsletter</h3>
                        <p className="text-gray-200 mb-3 xs:mb-4 text-sm xs:text-sm sm:text-base">Stay updated with our latest courses!</p>
                        <form className="flex flex-col space-y-2 max-w-[90%] xs:max-w-[260px] sm:max-w-[300px]" onSubmit={handleSubmit} aria-label="Newsletter signup">
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input id="email" type="email" placeholder="Enter your email" className="px-3 xs:px-3 sm:px-4 py-1.5 xs:py-1.5 sm:py-2 rounded-md text-gray-800 text-sm xs:text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C9A500]" required/>
                            <button type="submit" className="bg-[#C9A500] text-white px-3 xs:px-3 sm:px-4 py-1.5 xs:py-1.5 sm:py-2 rounded-md hover:bg-[#A78A00] transition-colors text-sm xs:text-sm sm:text-base">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-6 xs:mt-6 sm:mt-8 pt-4 xs:pt-4 sm:pt-6 border-t border-gray-700 text-center text-gray-400 text-sm xs:text-sm sm:text-base">
                    <p>© 2025 TBES. All rights reserved.</p>
                </div>
            </div>
        </footer>);
};
export default Footer;
