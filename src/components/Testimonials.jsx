import React, { useEffect, useState } from 'react';
import axios from "axios";
import { FaStar } from "react-icons/fa";
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: '' };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error: error.message };
    }
    render() {
        if (this.state.hasError) {
            return (<div className="text-center text-red-600 p-4">
                    <p>Something went wrong: {this.state.error}</p>
                    <button onClick={() => window.location.reload()} className="mt-2 bg-[#C9A500] text-black px-4 py-2 rounded-lg hover:bg-opacity-80">
                        Reload
                    </button>
                </div>);
        }
        return this.props.children;
    }
}
const Testimonials = () => {
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState("");
    const BASE_URL_ADDRESS = import.meta.env.VITE_API_URL || 'http://192.168.8.130:5000';
    const [apiBase, setApiBase] = useState('');
    const fetchReviews = async () => {
        setLoading(true);
        setError("");
        const newApiBase = BASE_URL_ADDRESS.endsWith('/api')
            ? BASE_URL_ADDRESS.slice(0, -4)
            : BASE_URL_ADDRESS.endsWith('/')
                ? BASE_URL_ADDRESS.slice(0, -1)
                : BASE_URL_ADDRESS;
        setApiBase(newApiBase);
        try {
            console.log(`Fetching reviews from ${newApiBase}/api/reviews`);
            const response = await axios.get(`${newApiBase}/api/reviews`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                timeout: 10000,
            });
            console.log("Reviews fetched:", response.data);
            setReviews(response.data || []);
        }
        catch (err) {
            console.error("Fetch reviews error:", {
                message: err.message,
                status: err.response?.status,
                data: err.response?.data,
                url: err.response?.config?.url,
                code: err.code,
            });
            setError(err.message === 'Network Error' ? 'Server unavailable, please try again later' : err.response?.data?.error || 'Failed to load reviews');
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchReviews();
    }, []);
    useEffect(() => {
        if (typeof window !== "undefined" && window.Swiper && reviews.length > 0) {
            console.log("Initializing Swiper");
            const swiper = new window.Swiper(".swiper", {
                direction: "horizontal",
                loop: reviews.length > 1,
                autoHeight: false,
                centeredSlides: true,
                slidesPerView: 1,
                spaceBetween: 20,
                breakpoints: {
                    320: { slidesPerView: 1, spaceBetween: 20 },
                    640: { slidesPerView: 2, spaceBetween: 30 },
                    1024: { slidesPerView: 3, spaceBetween: 40 },
                },
                pagination: { el: ".swiper-pagination", clickable: true },
                navigation: { nextEl: ".swiper-button-prev", prevEl: ".swiper-button-next" },
            });
            return () => {
                console.log("Destroying Swiper");
                if (swiper)
                    swiper.destroy();
            };
        }
        else if (!window.Swiper) {
            console.warn("Swiper not loaded. Using fallback grid.");
            if (!error && reviews.length > 0) {
                setError("Carousel not available. Showing reviews below.");
            }
        }
    }, [reviews]);
    return (<ErrorBoundary>
            <div className="bg-gradient-to-b from-[#364CE2] via-[#010D60] to-[#02051B] min-h-[80vh] xs:min-h-[80vh] sm:min-h-[85vh] flex flex-col items-center py-6 xs:py-8 sm:py-12 overflow-hidden font-['Montserrat',sans-serif]">
                <h1 className="text-2xl xs:text-2xl sm:text-3xl md:text-4xl text-center font-semibold text-white leading-tight w-full max-w-[90vw] xs:max-w-[260px] sm:max-w-[600px] md:max-w-[800px] mb-6 xs:mb-8 sm:mb-10">
                    Trusted by Thousands of Learners
                    <br />
                    Discover Their Success Stories
                </h1>
                {(error || imageError) && (<div className="bg-red-600 text-white p-3 xs:p-4 sm:p-4 rounded-lg mb-4 xs:mb-6 sm:mb-6 max-w-[90vw] xs:max-w-[260px] sm:max-w-[1000px] md:max-w-[1200px] w-full text-center text-xs xs:text-xs sm:text-sm">
                        {error || imageError}
                        {error && (<button onClick={fetchReviews} className="ml-2 xs:ml-3 bg-[#C9A500] text-black px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 sm:py-2 rounded-lg hover:bg-opacity-80 text-xs xs:text-xs sm:text-sm">
                                Retry
                            </button>)}
                    </div>)}
                <div className="w-full max-w-[90vw] xs:max-w-[260px] sm:max-w-[1000px] md:max-w-[1200px] text-center px-3 xs:px-4 sm:px-6">
                    {loading && (<div className="bg-white bg-opacity-10 rounded-lg p-6 xs:p-8 sm:p-12 text-center text-white text-base xs:text-lg sm:text-xl">
                            Loading reviews...
                        </div>)}
                    {!loading && reviews.length === 0 && !error ? (<div className="bg-white bg-opacity-10 rounded-lg p-6 xs:p-8 sm:p-12 text-center text-white">
                            <p className="text-base xs:text-base sm:text-lg">No reviews yet. Be the first to share your experience!</p>
                        </div>) : (<>
                            {window.Swiper && reviews.length > 0 ? (<div className="swiper p-4 xs:p-4 sm:p-6">
                                    <div className="swiper-wrapper">
                                        {reviews.map((review) => (<div className="swiper-slide bg-white bg-opacity-10 rounded-lg p-6 xs:p-6 sm:p-8 transition-all duration-500 ease-in-out" key={review._id}>
                                                <div className="flex flex-col items-center text-center text-white">
                                                    <div className="w-20 xs:w-20 sm:w-24 h-20 xs:h-20 sm:h-24 mb-3 xs:mb-4 sm:mb-4">
                                                        <img src={`${apiBase}${review.photo}`} alt={`${review.fullName}'s photo`} className="rounded-full w-full h-full object-cover" onError={(e) => {
                        console.error(`Failed to load image: ${apiBase}${review.photo}`);
                        e.currentTarget.src = "https://via.placeholder.com/80?text=Image+Not+Found";
                        setImageError("Some review images failed to load.");
                    }}/>
                                                    </div>
                                                    <p className="text-sm xs:text-sm sm:text-base leading-5 xs:leading-5 sm:leading-6 mb-3 xs:mb-4 sm:mb-4 min-h-[80px] xs:min-h-[80px] sm:min-h-[100px]">{`"${review.text}"`}</p>
                                                    <div className="flex justify-center mb-2 xs:mb-2 sm:mb-2">
                                                        {[...Array(5)].map((_, i) => (<FaStar key={i} className={`h-4 xs:h-4 sm:h-5 w-4 xs:w-4 sm:w-5 ${i < review.rating ? "text-[#C9A500]" : "text-gray-400"}`}/>))}
                                                    </div>
                                                    <p className="text-xs xs:text-xs sm:text-sm font-semibold">{`- ${review.fullName}, Student`}</p>
                                                </div>
                                            </div>))}
                                    </div>
                                    <div className="swiper-pagination mt-4 xs:mt-4 sm:mt-6"></div>
                                    <div className="flex justify-center items-center gap-3 xs:gap-3 sm:gap-4 mt-3 xs:mt-3 sm:mt-4">
                                        <div className="swiper-button-prev w-5 xs:w-5 sm:w-6 h-5 xs:h-5 sm:h-6 bg-gray-200 rounded-full cursor-pointer"></div>
                                        <div className="swiper-button-next w-5 xs:w-5 sm:w-6 h-5 xs:h-5 sm:h-6 bg-gray-200 rounded-full cursor-pointer"></div>
                                    </div>
                                </div>) : (<div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 xs:gap-4 sm:gap-6">
                                    {reviews.map((review) => (<div className="bg-white bg-opacity-10 rounded-lg p-6 xs:p-6 sm:p-8 text-center text-white" key={review._id}>
                                            <img src={`${apiBase}${review.photo}`} alt={`${review.fullName}'s photo`} className="rounded-full w-20 xs:w-20 sm:w-24 h-20 xs:h-20 sm:h-24 mx-auto mb-3 xs:mb-4 sm:mb-4 object-cover" onError={(e) => {
                        console.error(`Failed to load image: ${apiBase}${review.photo}`);
                        e.currentTarget.src = "https://via.placeholder.com/80?text=Image+Not+Found";
                        setImageError("Some review images failed to load.");
                    }}/>
                                            <p className="text-sm xs:text-sm sm:text-base leading-5 xs:leading-5 sm:leading-6 mb-3 xs:mb-4 sm:mb-4">{`"${review.text}"`}</p>
                                            <div className="flex justify-center mb-2 xs:mb-2 sm:mb-2">
                                                {[...Array(5)].map((_, i) => (<FaStar key={i} className={`h-4 xs:h-4 sm:h-5 w-4 xs:w-4 sm:w-5 ${i < review.rating ? "text-[#C9A500]" : "text-gray-400"}`}/>))}
                                            </div>
                                            <p className="text-xs xs:text-xs sm:text-sm font-semibold">{`- ${review.fullName}, Student`}</p>
                                        </div>))}
                                </div>)}
                        </>)}
                </div>
            </div>
        </ErrorBoundary>);
};
export default Testimonials;
