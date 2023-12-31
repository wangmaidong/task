import http from './http.js'
export const getTaskList = (state = 0) => {
    return http.get('/getTaskList', {
        params: {
            state
        }
    })
}
export const addTask = (task, complete) => {
    return http.post('/addTask', {
        task,
        complete
    })
}
export const removeTask = (id) => {
    return http.get('/removeTask', {
        params: {
            id
        }
    })
}
export const completeTask = (id) => {
    return http.get('/completeTask', {
        params: {
            id
        }
    })
}