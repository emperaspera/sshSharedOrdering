
import {useNavigate} from 'react-router-dom';

const Logo = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        const user = localStorage.getItem('user'); // Check if user is logged in
        if (user) {
            navigate('/main'); // Redirect to MainScreen
        }
    };

    return (
        <div className="flex items-center">
            <div
                className="bg-blue-500 px-7 p-2 rounded-full text-2xl md:text-3xl cursor-pointer flex items-center justify-center"
                style={{height: '90px', width: '90px'}}
                onClick={handleClick} // Add click event to redirect conditionally
            >
                <span className="text-white" style={{fontSize: '18px', WebkitTextStroke: '0.4px'}}>
                    SSH
                </span>
            </div>
        </div>
    );
}

export default Logo;