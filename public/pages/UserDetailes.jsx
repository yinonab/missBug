
import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { BugIndex } from './BugIndex.jsx'
import { bugService } from '../services/bug.service.js'

const { useState, useEffect } = React
const { Link, useParams } = ReactRouterDOM

export function UserDetails() {

    const [user, setUser] = useState(null)
    console.log('user', user);
    const [bugs, setBugs] = useState(null)
    // console.log('bugs', bugs);
    // const { userId } = useParams()
    // console.log('userId', userId);

    useEffect(() => {
       const logginUser =  userService.getLoggedinUser()
        setUser(logginUser)
        setBugs(bugService.getUserBugs(logginUser))
        // const bugs =bugService.getUserBugs(userId)
        // bugs.then(bugs => setBugs(bugs))
        // // .then(bugs => setBugs(bugs))
        // console.log('bugs:', bugs)
    }, [])
    // useEffect(() => {
    //     bugService.getUserBugs(userId)
    //     .then(bugs => setBugs(bugs))
    // }, [])

    if (!user) return <h1>loadings....</h1>
    return user && <div>
        <h3>User Details</h3>
        <h4> Full Name :{user.fullname}</h4>
        <Link to="/bug">Back to List</Link>
    </div>

}

