const getExecutionTime = (startTime?: number) => {
  const time = new Date().getTime() / 1000;

  if (startTime) {
    const now = new Date().getTime() / 1000;
    return Math.abs(startTime - now);
  }

  return time;
};

export default getExecutionTime;
