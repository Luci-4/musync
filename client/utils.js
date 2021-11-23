const fetchRequest = async (url) => {
    console.log("connecting to the cock")
    let res = await fetch(`http://localhost:3000/${url}`)
    console.log(res)
    let data = await res.text()
    console.log(data)
    return data
    // const res = await fetch(`http://localhost:3000/${url}`, { mode: 'no-cors' })
    // return await res.json()
    // const parsed = await res.text()
    // const parsed = res;
    // console.log(parsed.length)
    // return parsed
}
export {fetchRequest}