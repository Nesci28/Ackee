const test1 = {
  hour: 13,
  count: 2
};

const test2 = {
  hour: 12,
  count: 5
};

const test3 = { ...test1, ...test2 };
console.log("test3 :", test3);
