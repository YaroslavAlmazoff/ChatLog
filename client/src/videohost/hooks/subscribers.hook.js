const useSubscribers = () => {
    const declination = (count = '0') => {
        console.log(count)
        if(!count) return
        const last = count.toString().slice(-1)
        console.log(last)
        if(last === '0') {
            return count + ' подписчиков'
        } else if(last === '1') {
            return count + ' подписчик'
        } else if(last > '1' && last < '5') {
            return count + ' подписчика'
        } else if(last > '5') {
            return count + ' подписчиков'
        }
    }

    return {declination}
}

export default useSubscribers