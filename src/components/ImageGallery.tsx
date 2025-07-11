import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatarImage from '../assets/tbes_imgs/tbes1.jpg';
import avatarImage1 from '../assets/tbes_imgs/tbes2.jpg';
import avatarImage2 from '../assets/tbes_imgs/tbes3.jpg';
import avatarImage3 from '../assets/tbes_imgs/tbes4.jpg';
import avatarImage4 from '../assets/tbes_imgs/tbes5.jpg';
import avatarImage5 from '../assets/tbes_imgs/tbes6.jpg';
import avatarImage6 from '../assets/tbes_imgs/tbes9.jpg';
import background from '../assets/Group 7.png';

const ImageGallery: React.FC = () => {
    const [photos, setPhotos] = useState([
        { id: 1, src: avatarImage, alt: 'Photo 1' },
        { id: 2, src: avatarImage1, alt: 'Photo 2' },
        { id: 3, src: avatarImage2, alt: 'Photo 3' },
        { id: 3, src: avatarImage4, alt: 'Photo 4' },
        { id: 3, src: avatarImage5, alt: 'Photo 5' },
    ]);
    const [allPhotos, setAllPhotos] = useState([
        { id: 1, src: avatarImage, alt: 'Photo 1' },
        { id: 2, src: avatarImage1, alt: 'Photo 2' },
        { id: 3, src: avatarImage2, alt: 'Photo 3' },
        { id: 4, src: avatarImage3, alt: 'Photo 4' },
        { id: 5, src: avatarImage4, alt: 'Photo 5' },
        { id: 6, src: avatarImage5, alt: 'Photo 6' },
        { id: 6, src: avatarImage6, alt: 'Photo 6' },
    ]);
    const navigate = useNavigate();

    useEffect(() => {
        const updatePhotos = () => {
            const lastUpdate = localStorage.getItem('lastPhotoUpdate');
            const today = new Date().toDateString();
            if (!lastUpdate || lastUpdate !== today) {
                const newPhoto = { id: allPhotos.length + 1, src: avatarImage5, alt: `Photo ${allPhotos.length + 1}` };
                setAllPhotos((prev) => [...prev, newPhoto]);
                setPhotos((prev) => [prev[1], prev[2], newPhoto].slice(0, 3));
                localStorage.setItem('lastPhotoUpdate', today);
            }
        };
        updatePhotos();
        const interval = setInterval(updatePhotos, 24 * 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, [allPhotos.length]);

    useEffect(() => {
        localStorage.setItem('galleryPhotos', JSON.stringify(allPhotos));
    }, [allPhotos]);

    const handleShowMore = () => {
        navigate('/full-gallery');
    };

    return (
        <div className="bg-white flex flex-col items-center min-h-screen overflow-hidden relative">
            <div className="relative">
                <h1 className="text-black text-[40px] font-bold absolute top-[40px] right-[440px]">Gallery</h1>
            </div>

            <img
                src={background}
                alt="Decorative Graphic"
                className="absolute top-0 right-[-150px] w-[850px] pointer-events-none z-0 md:right-[665px]"
            />
            <div className="w-full max-w-[1200px] px-6 flex-1 relative top-[200px]">
                <div className="relative">
                    <div className="overflow-hidden ">
                        <div className="flex animate-scroll space-x-4 ">
                            {/* Render photos twice for seamless looping */}
                            {[...photos, ...photos].map((photo, index) => (
                                <div
                                    key={`${photo.id}-${index}`}
                                    className="min-w-[460px] h-auto aspect-square rounded-lg overflow-hidden hover:paused"
                                >
                                    <img src={photo.src} alt={photo.alt} className="max-w-[450px] w-full h-auto object-contain" />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleShowMore}
                        className="absolute top-[-60px] right-0 text-black text-[20px] px-4 py-2 rounded-md hover:text-[#364CE2] transition-colors"
                    >
                        Show More
                    </button>
                    <style>
                        {`
              @keyframes scroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .animate-scroll {
                display: flex;
                width: max-content;
                animation: scroll 20s linear infinite;
              }
              .paused {
                animation-play-state: paused !important;
              }
            `}
                    </style>
                </div>
            </div>
        </div>
    );
};

const FullGallery: React.FC = () => {
    const [galleryPhotos, setGalleryPhotos] = useState(() => {
        const storedPhotos = localStorage.getItem('galleryPhotos');
        return storedPhotos ? JSON.parse(storedPhotos) : [];
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const storedPhotos = localStorage.getItem('galleryPhotos');
            if (storedPhotos) {
                setGalleryPhotos(JSON.parse(storedPhotos));
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <div className="bg-white flex flex-col items-center overflow-hidden">
            <h1 className="text-[40px] text-center font-bold bg-gradient-to-r from-[#364CE2] via-[#283BBE] to-[#010D60] text-transparent bg-clip-text leading-tight w-full max-w-[800px] mb-16 font-inter">
                Full Photo Gallery
            </h1>

            <div className="w-full max-w-[1200px] px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 flex-1">
                {galleryPhotos.length > 0 ? (
                    galleryPhotos.map((photo: { id: number; src: string; alt: string }) => (
                        <div key={photo.id} className="w-full aspect-auto bg-gray-200 rounded-lg overflow-hidden">
                            <img
                                src={photo.src}
                                alt={photo.alt}
                                className="w-full object-cover transition-transform duration-500 ease-in-out transform hover:scale-110"
                            />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 font-inter">No photos available.</p>
                )}
            </div>
        </div>

    );
};

export { ImageGallery, FullGallery };