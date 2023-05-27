const useArray = () => {
    const unique = a => [...new Set(a)];

    return {unique}
}

export default useArray