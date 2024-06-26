
import { AiFillCloseCircle } from "react-icons/ai";
import { FiMenu } from "react-icons/fi";
// import { useDispatch, useSelector } from "react-redux";
import { Link} from "react-router-dom";

import Footer from "../components/Footer.jsx";
function HomeLayout ({children}) {
    // const dispatch =useDispatch();
    // const navigate = useNavigate();
    

    function changeWidth() {
        const drawerSide = document.getElementsByClassName('drawer-side');
        drawerSide[0].style.width='auto';
    }
     function hideDrawer() {
        const element = document.getElementsByClassName('drawer-toggle');
        element[0].checked=false;
        const drawerSide = document.getElementsByClassName('drawer-side');
        drawerSide[0].style.width='0';
    }
    return(
        <div  className="min-h-[90vh]">
            <div className='"drawer absolute left-0 z-50 w-full'>
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <label htmlFor="my-drawer">
                        <FiMenu size={"32px"} className="font-bold text-white m-4" onClick={changeWidth} />
                    </label>
                </div>
             <div className="drawer-side w-0">
                 <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-48 sm:w-80 bg-base-200 text-base-content relative">
        {/* Sidebar content here */}
                    <li className="w-fit absolute right-2 z-50"><button>
                        <AiFillCloseCircle size={24} onClick={hideDrawer} /></button></li>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/about'>About</Link></li>
                    <li><Link to='/contact'>Contact Us</Link></li>
                    <li><Link to='/courses'>All Courses</Link></li>
        
        
                </ul>
            </div>
        </div>
        {children}
        <Footer/>
    </div>
    );}
export default HomeLayout