interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: string[];
}
declare const ProtectedRoute: React.FC<ProtectedRouteProps>;
export default ProtectedRoute;
