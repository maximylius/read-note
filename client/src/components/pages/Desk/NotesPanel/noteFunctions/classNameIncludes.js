// ok
const classNameIncludes = (className, checkFor) => {
  if (typeof className !== 'string') return false;
  return className.includes(checkFor);
};
export default classNameIncludes;
