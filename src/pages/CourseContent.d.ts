import React from 'react';
interface CourseContent {
    id: number;
    title: string;
    description: string;
    rating: number;
    reviews: number;
    objectives: string[];
    stack: string[];
    overview: string[];
    enrolled: number;
    duration: string;
    seats: string;
    levels: string;
    certificate: string;
    freeVideos: {
        title: string;
        url: string;
    }[];
}
declare const CourseContent: React.FC;
export default CourseContent;
