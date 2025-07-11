import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPg from './components/Auth.tsx';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import EnrollStudent from './components/EnrollStudent';
import ActivateAccount from './components/ActivateAccount.tsx';
import UserDashboard from './components/UserDashboard.tsx';
import Home from './pages/Home.tsx';
import Courses from './components/Courses.tsx';
import AboutUs from './components/AboutUs.tsx';
import ContactUs from './components/ContactUs.tsx';
import StudentDashboard from './components/StudentDashboard.tsx';
import ManagerDashboard from './components/ManagerDashboard';
import TutorDashboard from './components/TutorDashboard';
import Layout from './components/Layout';
import CourseContent from './pages/CourseContent.tsx';
import { FullGallery } from './components/ImageGallery.tsx';
import CourseContentEdit from './components/CourseContentEdit.tsx';
import ModuleManager from "./components/ModuleManager.tsx";
const App = () => {
    return (<BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPg />}/>
                <Route path="/student/*" element={<ProtectedRoute allowedRoles={['student']}>
                            <StudentDashboard />
                        </ProtectedRoute>}/>
                <Route path="/superadmin-dashboard" element={<ProtectedRoute allowedRoles={['superadmin']}>
                            <SuperAdminDashboard />
                        </ProtectedRoute>}/>
                <Route path="/admindashboard" element={<ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>}/>
                <Route path="/manager" element={<ProtectedRoute allowedRoles={['manager']}>
                            <ManagerDashboard />
                        </ProtectedRoute>}/>
                <Route path="/modules" element={<ProtectedRoute allowedRoles={['superadmin']}>
                        <ModuleManager />
                    </ProtectedRoute>}/>

                <Route path="/key-links" element={<StudentDashboard />}/>
                <Route path="/student-profile" element={<StudentDashboard />}/>
                <Route path="/activity" element={<StudentDashboard />}/>
                <Route path="/modules-courses" element={<StudentDashboard />}/>

                <Route path="/academic-calendar" element={<StudentDashboard />}/>
                <Route path="/messages" element={<StudentDashboard />}/>
                <Route path="/marks" element={<StudentDashboard />}/>
                <Route path="/tools" element={<StudentDashboard />}/>

                <Route path="/coursecontent" element={<CourseContent />}/>
                <Route path="/coursecontent/:courseId" element={<CourseContent />}/>
                <Route path="/courses/:courseId/edit" element={<CourseContentEdit />}/>
                <Route path="/userdashboard" element={<UserDashboard />}/>
                <Route path="/full-gallery" element={<FullGallery />}/>

                <Route element={<Layout />}>
                    <Route path="/" element={<Home />}/>
                    <Route path="/enroll-student" element={<EnrollStudent />}/>
                    <Route path="/activate-account" element={<ActivateAccount />}/>
                    <Route path="/tutor" element={<ProtectedRoute allowedRoles={['tutor']}><TutorDashboard /></ProtectedRoute>}/>
                    <Route path="/courses" element={<Courses />}/>
                    <Route path="/aboutus" element={<AboutUs />}/>
                    <Route path="/contactus" element={<ContactUs />}/>
                </Route>
            </Routes>
        </BrowserRouter>);
};
export default App;
