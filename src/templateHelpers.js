export default {
    inc: value => parseInt(value) + 1,
    plural: length => length === 1 ? '' : 's',
    valueOrDefault: (defaultValue, result) => result ? result : defaultValue,
    isTrue: (param, success, failure) => param ? success : failure,
    longDate: dateString => {
        if (!dateString)
            return ''

        return new Date(dateString).toLocaleDateString('en-us', { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
    },
    shortDate: dateString => {
        if (!dateString)
            return ''

        return new Date(dateString).toLocaleDateString('en-us', { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
    },
    clip: (length, string) => {
        if (!string)
            return ''

        if (string.length <= length)
            return string

        return string.slice(0, length) + '...'
    },
    bytes: bytes => {
        bytes = parseFloat(bytes)
        if (bytes == null || isNaN(bytes) || typeof(bytes) === 'object'){
            return '-'
        }
        
        const k = 1024
        const sizes = ['bytes', 'KB', 'MB', 'GB', 'TB']
        const i = bytes <= 0 ? 0 : Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },
    kw: kw => {
        kw = parseFloat(kw)
        if (kw == null || isNaN(kw) || typeof(kw) === 'object'){
            return '-'
        }
        return (kw * 1000).toFixed(5) + ' watts'
    },
    co2: grams => {
        grams = parseFloat(grams)
        if (grams == null || isNaN(grams) || typeof(grams) === 'object'){
            return '-'
        }
        return grams + ' g'
    },
    delivery: isCache => isCache ? 'Cache' : 'Network',
    fixed: (places = 2, number) => parseFloat(number).toFixed(places),
    round: (number) => parseFloat((number || 0).toString()),
    gt: (a, b) => a > b,
    gte: (a, b) => a >= b,
    lt: (a, b) => a < b,
    lte: (a, b) => a <= b,
    is: (a, b) => a === b,
}