// creating a vairable to hold the DB connections
let db;

// extablish a link to indexDB DB called budget_tracker
const request = indexedDB.open("budget_tracker", 1);

// this will trigger when the database version numbers is triggered
request.onupgradeneeded = function (event) {
  // save a reference to the DB
  const db = event.target.result;
  // this will create an object store (table) called "new_budget" and set it to have auto incrementing primary key
  db.createObjectStore("new_budget", { autoIncrement: true });
  // when db is successfully created with its object store (from onupgradedneedede event above)
};

// upon a successful
request.onsuccess = function (event) {
  // when db is opened successfully
  db = event.target.result;
  // check if the app is line, if yes run the upload function
  if (navigator.onLine) {
    uploadBudget();
  }
};

request.onerror = function (event) {
  // log error here
  console.log(event.target.errCode);
};

// this function will be execute if we attempt to submit a new budget and theres no internet connection
function saveRecord(record) {
  // open a new transaction with the database with read and write permissions
  const transaction = db.transaction(["new_budget"], "readwrite");

  // access the object store for 'new_budget'
  const budgetObjectStore = transaction.objectStore("new_budget");

  // add record to your store with add methods
  budgetObjectStore.add(record);
}

function uploadBudget() {
  const transaction = db.transaction(["new_budget"], "readwrite");

  const budgetObjectStore = transaction.objectStore("new_budget");

  const getAll = budgetObjectStore.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain,/",
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          response.json();
        })
        .then((serverResponse) => {
          if (serverResponse) {
            throw new Error(serverResponse)
        }
            const transaction = db.transaction(["new_budget"], "readwrite");
            const budgetObjectStore = transaction.objectStore("new_budget");

            budgetObjectStore.clear();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
}

window.addEventListener('online', uploadBudget);
