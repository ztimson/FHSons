import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import * as paypal from 'paypal-rest-sdk';

const cors = require('cors')({origin: true});

admin.initializeApp();

paypal.configure({
  mode: 'sandbox',
  client_id: 'AaU8tQfmz1_MFDTKuf84yYERXvdDt2ZFJVrxhNW_49DazF4A_F0VBuKyV5_nntyEdZqUa5Oq9ZBj65GV',
  client_secret: 'EAZ8aFDU4lHHLy1bQqULYWqznf3dBknXZW3AH__zFC0bUs8AGUyR6RNbm-jHvqtikX7PsSqMO5vxuvKm'
});

export const checkout = functions.https.onRequest((request, response) => {
  cors(request, response, async () => {
    // Create base request
    let req = {
      intent: 'sale',
      payer: {payment_method: 'paypal'},
      redirect_urls: {
        return_url: 'https://fhsons.zakscode.com/cart/success',
        cancel_url: 'https://fhsons.zakscode.com/cart/cancelled'
      },
      transactions: [
        {
          item_list: {items: []},
          description: 'Purchase of equipment and suplies from FH & Sons'
        }
      ]
    };

    // Fill in information from DB
    let promises = [];
    let cart = request.body.cart.filter(row => row.quantity > 0);
    cart.forEach(async row =>
      promises.push(
        admin
          .firestore()
          .doc(`products/${row.id}`)
          .get()
      )
    );

    let products = await Promise.all(promises);
    req.transactions[0].item_list.items = products.map((row, i) => {
      const data = row.data();
      return {name: data.name, sku: data.name, price: data.price, currency: data.currency, quantity: cart[i].quantity};
    });
    req.transactions[0].amount.total = req.transactions[0].item_list.items.reduce((acc, row, i) => {
      return acc + row.price * row.quantity;
    }, 0);

    console.info(req);

    // Send request to PayPal
    let create = new Promise((res, rej) => {
      paypal.payment.create(req, (error, payment) => {
        if (error) rej(error);

        let link = payment.links.filter(row => row.rel == 'approval_url').map(row => row.href)[0];

        if (link) {
          res(link);
        } else {
          rej('no redirect URI present');
        }
      });
    });

    try {
      response.json({url: await create});
    } catch (err) {
      console.error(err);
      response.status(500);
    }
  });
});

exports.process = functions.https.onRequest((req, res) => {
  const paymentId = req.query.paymentId;
  const payerId = {
    payer_id: req.query.PayerID
  };
  return paypal.payment
    .execute(paymentId, payerId, (error, payment) => {
      if (error) {
        console.error(error);
        res.redirect(`${req.protocol}://${req.get('host')}/error`); // replace with your url page error
      } else {
        if (payment.state === 'approved') {
          console.info('payment completed successfully, description: ', payment.transactions[0].description);
          // console.info('req.custom: : ', payment.transactions[0].custom);
          // set paid status to True in RealTime Database
          const date = Date.now();
          const uid = payment.transactions[0].description;
          const ref = admin.database().ref('users/' + uid + '/');
          ref.push({
            paid: true,
            // 'description': description,
            date: date
          });
          res.redirect(`${req.protocol}://${req.get('host')}/success`); // replace with your url, page success
        } else {
          console.warn('payment.state: not approved ?');
          // replace debug url
          res.redirect(
            `https://console.firebase.google.com/project/${
              process.env.GCLOUD_PROJECT
            }/functions/logs?search=&severity=DEBUG`
          );
        }
      }
    })
    .then(r => console.info('promise: ', r));
});
