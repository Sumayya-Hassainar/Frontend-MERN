import { useEffect, useState } from 'react'


export default function useFetch(fetcher, deps = []) {
const [data, setData] = useState(null)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null)


useEffect(() => {
let cancelled = false
async function run() {
setLoading(true)
setError(null)
try {
const res = await fetcher()
if (!cancelled) setData(res)
} catch (err) {
if (!cancelled) setError(err.message || String(err))
} finally {
if (!cancelled) setLoading(false)
}
}
run()
return () => (cancelled = true)
}, deps) // eslint-disable-line


return { data, loading, error }
}