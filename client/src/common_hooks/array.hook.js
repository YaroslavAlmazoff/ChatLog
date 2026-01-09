const useArray = () => {
  const unique = (a) => [...new Set(a)];
  const uniqueObjects = (array) =>
    array.filter(
      (obj, index, self) => index === self.findIndex((o) => o._id === obj._id)
    );
  return { unique, uniqueObjects };
};

export default useArray;
