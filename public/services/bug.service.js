
// import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const BASE_URL = '/api/bug/'
const STORAGE_KEY = 'bugDB'

_createBugs()

export const bugService = {
    query,
    getById,
    save,
    remove,
    getDefaultFilter,
    getUserBugs
}


function query(filterBy = {}) {
    return axios.get(BASE_URL,{ params: filterBy }).then(res => res.data)
    // .then(bugs => {
    //     // console.log('bugs:', bugs)
    //     if (filterBy.title) {
    //         const regExp = new RegExp(filterBy.title, 'i')
    //         bugs = bugs.filter(bug => regExp.test(bug.title))
    //     }

    //     if (filterBy.minSeverity) {
    //         bugs = bugs.filter(bug => bug.severity >= filterBy.minSeverity)
    //     }
    //     return bugs
    // })
}
function getById(bugId) {
    // return storageService.query(CAR_KEY)
    return axios.get(BASE_URL + bugId).then(res => res.data)
}
function getUserBugs(userId) {
    console.log('userId:', BASE_URL +'user/'+ userId._id)
    return axios.get(BASE_URL +'user/'+ userId).then(res => res.data)
}

function remove(bugId) {
    // return storageService.get(CAR_KEY, carId)
    return axios.delete(BASE_URL + bugId).then(res => res.data)
}

function save(bug) {
    console.log('bug', bug)
    const url = BASE_URL + 'save'
    // let queryParams = `?title=${bug.title}&severity=${bug.severity}&description=${bug.description}`

    // if (bug._id) queryParams += `&_id=${bug._id}`
    const method = bug._id ? 'put' : 'post'
    return axios[method](BASE_URL, bug).then(res => res.data)
}

function getDefaultFilter() {
    return { title: '', severity: '',pageIdx:0,labels:'',sortBy:'' }
}

function _createBugs() {
    let bugs = utilService.loadFromStorage(STORAGE_KEY)
    if (!bugs || !bugs.length) {
        bugs = [
            {
                title: "Infinite Loop Detected",
                severity: 4,
                _id: "1NF1N1T3"
            },
            {
                title: "Keyboard Not Found",
                severity: 3,
                _id: "K3YB0RD"
            },
            {
                title: "404 Coffee Not Found",
                severity: 2,
                _id: "C0FF33"
            },
            {
                title: "Unexpected Response",
                severity: 1,
                _id: "G0053"
            }
        ]
        utilService.saveToStorage(STORAGE_KEY, bugs)
    }
}
