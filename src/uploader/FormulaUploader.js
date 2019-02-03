const fs = require('fs');
const firebase = require('firebase');

(function() {
    firebase.initializeApp({
        apiKey: "AIzaSyC7BFq-px3_XBC4VbV5noRDB4yK2Gfvz24",
        authDomain: "fhsons-7e90b.firebaseapp.com",
        databaseURL: "https://fhsons-7e90b.firebaseio.com",
        projectId: "fhsons-7e90b",
        storageBucket: "fhsons-7e90b.appspot.com",
        messagingSenderId: "928837712391"
    });
    const db = firebase.firestore();

    const formulas = JSON.parse(fs.readFileSync('./formulas.json').toString()).map(f => Object.assign(f, {createdOn: new Date(f.createdOn), approvedOn: new Date(f.approvedOn)}));

    formulas.forEach(async (formula, i) => {
        await db.collection('formulas').doc(formula.name).set(formula);
        console.log(`${i + 1}/${formulas.length}`)
    });
})();


