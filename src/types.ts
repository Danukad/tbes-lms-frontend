// User data returned from API
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

// Course data
export interface Course {
    _id?: string;
    title: string;
    description: string;
    duration: string;
}

// Register API response
export interface RegisterResponse {
    token: string;
    user: {
        uniqueID?: string;
        role: string;
        email: string;
        fullName?: string;
    };
}

// Login API response
export interface LoginResponse {
    token: string;
    user: User;
}

// Error response from API
export interface ApiError {
    error: string;
}