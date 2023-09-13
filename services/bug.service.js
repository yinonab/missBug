import { utilService } from "./utils.service.js"
import fs from 'fs'

export const bugService = {
    query,
    getById,
    save,
    remove,
    getUserBugs
}


const PAGE_SIZE = 3


const bugs = utilService.readJsonFile('data/bug.json')


function query(filterBy) {
    let bugToReturn = bugs

    // console.log('filterBy', filterBy)
    // console.log('bugToReturn', bugToReturn)

    if (filterBy.title) {
        const regExp = new RegExp(filterBy.title, 'i')
        bugToReturn = bugToReturn.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
    }


    if (filterBy.severity) {
        bugToReturn = bugToReturn.filter(bug => bug.severity >= filterBy.severity)
    }

    if (filterBy.labels) {
        const labelArray = filterBy.labels.split(',')
        bugToReturn = bugToReturn.filter(bug =>
            bug.labels && bug.labels.some(label => labelArray.includes(label))
        )
    }
    if (filterBy.pageIdx !== undefined) {
        const startIdx = filterBy.pageIdx * PAGE_SIZE
        bugToReturn = bugToReturn.slice(startIdx, startIdx + PAGE_SIZE)
    }
    if (filterBy.sortBy === 'severity') {
        bugToReturn.sort((a, b) => a.severity - b.severity);
    } else if (filterBy.sortBy === 'createdAt') {
        bugToReturn.sort((a, b) => a.createdAt - b.createdAt);
    }
    else if (filterBy.sortBy === 'title') {
        bugToReturn.sort((a, b) => a.title.localeCompare(b.title));
    }

    return Promise.resolve(bugToReturn)
}
function getUserBugs(userId) {
    let bugToReturn = bugs
    if (userId) {
        bugToReturn = bugToReturn.filter(bug => bug.owner._id === userId)
        console.log('bugToReturn', bugToReturn)
        return Promise.resolve(bugToReturn)
    }
}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId, loggedinUser) {
    const bugIdx = bugs.findIndex(bug => bug._id === bugId)
    if (bugIdx === -1) return Promise.reject('No Such Bug')
    const bug = bugs[bugIdx]
    if (!loggedinUser.isAdmin &&
        bug.owner._id !== loggedinUser._id) {
        return Promise.reject('Not your bug')
    }
    bugs.splice(bugIdx, 1)
    return _saveBugsToFile()
    // return Promise.resolve()
}

function save(bug, loggedinUser) {
    bug.createdAt = Date.now()
    if (bug._id) {
        const bugIdx = bugs.findIndex(currBug => currBug._id === bug._id)
        if (bugs[bugIdx].owner._id !== loggedinUser._id) return Promise.reject('Not your Bug')

        bugs[bugIdx] = bug
    } else {
        bug._id = utilService.makeId()
        bug.owner = loggedinUser
        bugs.unshift(bug)
    }

    return _saveBugsToFile().then(() => bug)
}

function _saveBugsToFile() {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(bugs, null, 2)
        fs.writeFile('data/bug.json', data, (err) => {
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })
}