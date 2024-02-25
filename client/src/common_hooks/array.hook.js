const useArray = () => {
  const unique = (a) => [...new Set(a)];
  const uniqueObjects = (array) =>
    objectsArray.filter(
      (obj, index, self) => index === self.findIndex((o) => o.id === obj.id)
    );
  return { unique, uniqueObjects };
};

export default useArray;
