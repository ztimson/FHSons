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

    const components = JSON.parse(fs.readFileSync('./components.json').toString()).map(c => Object.assign(c, {createdOn: new Date(c.createdOn)}));

    components.forEach(async (comp, i) => {
        await db.collection('components').doc(comp.name).set(comp);
        console.log(`${i + 1}/${components.length}`);
    });
})();
