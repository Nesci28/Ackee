const labels = [];
for (let i = 30; i >= 0; i--) {
  let d = new Date();
  d.setDate(d.getDate() - i);
  d = d.toISOString();
  d = d.split("T")[0].split("-");
  const [year, month, day] = d;
  const value = `${year}-${month}-${day}`;
  labels.push(value);
}

console.log("labels :", labels);
