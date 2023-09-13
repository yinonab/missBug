import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { pdfService } from './services/PDFService.js'
import { userService } from './services/user.service.js'

const app = express()

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())


// Express Routing:
app.get('/', (req, res) => res.send('Hello there'))
// app.listen(3030, () => console.log('Server ready at port 3030'))


// Get Bugs (READ)
// Get Bugs (READ-filterBy)
app.get('/api/bug', (req, res) => {
    const filterBy = {
        title: req.query.title || '',
        severity: +req.query.severity || 0,
        labels: req.query.labels || '',
        createdAt: req.query.createdAt || '',
        sortBy: req.query.sortBy || '',
        pageIdx: req.query.pageIdx ? +req.query.pageIdx : undefined

    }
    bugService.query(filterBy)
        .then(bugs => {
            pdfService.buildBugsPDF(bugs)
            console.log('success: PDF created.')
            res.send(bugs)
            console.log('bugs', bugs)
        })
        .catch(err => {
            loggerService.error('Cannot get bugs', err)
            res.status(400).send('Cannot get bugs')
        })
    // console.log('bugs', bugs)
})

// Save Bug (CREATE)
app.post('/api/bug', (req, res) => {
    console.log('req.query:', req.body)
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')
    const bug = {
        title: req.body.title,
        severity: +req.body.severity,
        description: req.body.description,
        labels: req.body.labels,
    }
    console.log('bug', bug)
    bugService.save(bug,loggedinUser)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

//update
app.put('/api/bug', (req, res) => {
    console.log('req.query:', req.body)
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')
    const bug = {
        _id: req.body._id,
        title: req.body.title,
        severity: +req.body.severity,
        description: req.body.description,
        labels: req.body.labels,
    }
    console.log('bug', bug)
    bugService.save(bug,loggedinUser)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot save bug', err)
            res.status(400).send('Cannot save bug')
        })
})

// Get Bug (READ)
app.get('/api/bug/:bugId', (req, res) => {
    const bugId = req.params.bugId
    let viewItem = req.cookies.viewItem || []
    console.log('viewItem', viewItem)
    if (viewItem.length >= 3) {
        return res.status(400).send('Cannot get bug')
    } else if (!viewItem.includes(bugId)) {
        viewItem.push(bugId)
        res.cookie('viewItem', viewItem, { maxAge: 1000 * 20 })
    }
    bugService.getById(bugId)
        .then(bug => {
            res.send(bug)
        })
        .catch((err) => {
            loggerService.error('Cannot get bug', err)
            res.status(400).send('Cannot get bug')
        })
})

app.get('/api/bug/user/:userId', (req, res) => {
    const userId = req.params.userId;
    
    bugService.getUserBugs(userId)
        .then(bugs => {
            console.log('bugs', bugs)
            res.send(bugs);
        })
        .catch(err => {
            loggerService.error('Cannot get user-specific bugs', err);
            res.status(400).send('Cannot get user-specific bugs');
        });
});

// Remove Car (Delete)
app.delete('/api/bug/:bugId', (req, res) => {
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot add bug')
    const bugId = req.params.bugId

    bugService.remove(bugId,loggedinUser)
        .then(() => {
            console.log(`bug ${bugId} removed!`)
            res.send('Bug removed Successfully!')
            // res.redirect('/api/bug')
        })
        .catch((err) => {
            loggerService.error('Cannot remove bug', err)
            res.status(400).send('Cannot remove bug')
        })

})

// Get Users (READ)
app.get('/api/user', (req, res) => {

    userService.query()
        .then(users => {
            res.send(users)
        })
        .catch(err => {
            loggerService.error('Cannot get users', err)
            res.status(400).send('Cannot get users')
        })
})

// Get Users (READ)
app.get('/api/user/:userId', (req, res) => {

    const { userId } = req.params

    userService.getById(userId)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot get user', err)
            res.status(400).send('Cannot get user')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = req.body
    userService.checkLogin(credentials)
        .then(user => {
            if (user) {
                const loginToken = userService.getLoginToken(user)
                res.cookie('loginToken', loginToken)
                res.send(user)
            } else {
                res.status(401).send('Invalid Credentials')
            }
        })
})



app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body
    userService.add(credentials)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Cannot signup', err)
            res.status(400).send('Cannot signup')
        })
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Loggedout..')
})
app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = 3030
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)