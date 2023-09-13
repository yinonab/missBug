import { userService } from '../services/user.service.js';
import { showErrorMsg } from '../services/event-bus.service.js';
import { BugIndex } from './BugIndex.jsx';
import { bugService } from '../services/bug.service.js';

const { useState, useEffect } = React;
const { Link, useParams } = ReactRouterDOM;

export function UserDetails() {
    const [user, setUser] = useState(null);
    const [bugs, setBugs] = useState([]);
    const { userId } = useParams();

    useEffect(() => {
        // Fetch user information
        const loggedInUser = userService.getLoggedinUser();
        setUser(loggedInUser);

        if (loggedInUser) {
            // Fetch the user's bugs using their ID
            bugService.getUserBugs(loggedInUser._id)
                .then(bugs => setBugs(bugs))
                .catch(error => {
                    console.error('Error fetching user bugs:', error);
                });
        }
    }, []);

    if (!user) return <h1>Loading...</h1>;

    return (
        <div>
            <h3>User Details</h3>
            <h4>Full Name: {user.fullname}</h4>
            
            <h3>User's Bugs</h3>
            {bugs.length > 0 ? (
                <ul>
                    {bugs.map(bug => (
                        <li key={bug._id}>{bug.title}</li>
                    ))}
                </ul>
            ) : (
                <p>No bugs found for this user.</p>
            )}
            
            <Link to="/bug">Back to List</Link>
       </div>
);
}