export default function useList() {
  const getIsLast = (index, count) => {
    return index === count - 1;
  };
  const getIsSingle = (count) => {
    return count === 1;
  };

  return { getIsLast, getIsSingle };
}
