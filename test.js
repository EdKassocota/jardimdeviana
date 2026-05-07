fetch("http://localhost:3000/api/reservations", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({"date":"2026-05-10","time":"12:00","pax":2,"tableId":"t1","client":{"name":"Test","phone":"123","email":""}})
}).then(res => res.json()).then(console.log).catch(console.error);
