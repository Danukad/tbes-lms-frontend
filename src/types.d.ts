export interface User {
    _id?: string;
    uniqueID?: string;
    role: 'superadmin' | 'manager' | 'tutor' | 'student' | 'user';
    fullName?: string;
    email: string;
    phoneNumber?: string;
    city?: string;
    selectedCourse?: string;
    isActivated?: boolean;
}
export interface Course {
    _id?: string;
    title: string;
    description: string;
    duration: string;
}
export interface RegisterResponse {
    token: string;
    user: {
        uniqueID?: string;
        role: string;
        email: string;
        fullName?: string;
    };
}
export interface LoginResponse {
    token: string;
    user: User;
}
export interface ApiError {
    error: string;
}
