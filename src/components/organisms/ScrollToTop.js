import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname } = useLocation(); // Get the current route

    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to the top when the route changes
    }, [pathname]);

    return null; // This component doesn't render anything
};

export default ScrollToTop;
