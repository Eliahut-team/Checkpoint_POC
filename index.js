const res = require('express/lib/response');

const express = require( 'express' ),
        app = express(),
        { engine } = require('express-handlebars'),
        port = 5000;
        //port = process.eventNames.port || 5000

        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());

        app.engine( 'handlebars', engine({
            defaultLayout: 'main'
}));

//import { configAuth } from './config.js'
var config = require("./config")

var axios = require("axios").default;
var exemail;
var excompany;
var exfname;
var exlname;
var exuserrole;
app.set( 'view engine', 'handlebars' );

app.get( '/', (req, res) => res.render( 'home' ) );

app.get( '/form', (req, res) => res.render( 'form' ) );

app.post ( '/form_post', ( req, res ) => {
    //console.log(req.body); // the data we get is in the body of request
    console.log('We got email ' + req.body.femail); // the data we get is in the body of request
    console.log("!!! Eliahu test configAuth.client_id = " + config._client_id);
    console.log("!!!! Eliahu test domain = " + config._domain);

        let urlFromConfig = "https://" + config._domain + "/passwordless/start"

        var options = {
        method: 'POST',
        url: urlFromConfig,
        //url: 'https://bchasid.us.auth0.com/passwordless/start',
        headers: {'content-type': 'application/json'},
        data: {
            //client_id: 'qEvjXkJfNLGfSpeX05phJyc7DsZbkhZ0',
            client_id: config._client_id,
            connection: 'email',
            email: req.body.femail,
            send: 'code'
        }
    };

    console.log("!!!! Eliahu test options url = " + options.url);

    console.log(req.body);
    exemail = req.body.femail;
    excompany = req.body.fcompany;
    exfname =req.body.ffname;
    exlname = req.body.flname;
    exuserrole=req.body.role;
    axios.request(options).then(function (response) {
        console.log('!!!!! Eliahu test ' + response.data);
      }).catch(function (error) {
        console.error('!!!!!! Eliahu test ' + error);
      });


    res.redirect ( '/form');
} );

app.post ( '/form_post-code', ( req, res ) => {
    console.log('We got code ' + req.body.fCode); // the data we get is in the body of request



    var options = {
        method: 'POST',
        url: 'https://bchasid.us.auth0.com/oauth/token',
        headers: {'content-type': 'application/json'},
        data: {
          grant_type: 'http://auth0.com/oauth/grant-type/passwordless/otp',
          client_id: config._client_id,
          //client_id: 'qEvjXkJfNLGfSpeX05phJyc7DsZbkhZ0',
          username: exemail,
          otp: req.body.fCode,
          realm: 'email',
          audience: 'https://127.0.0.1/temp',
          scope: 'openid profile email',
          company: excompany,
          userRole: exuserrole,
          firstName: exfname,
          lastName: exlname

       }
      };
     // console.log(options)
      axios.request(options).then(function (response) {

        console.log(response.data);

        res.redirect ( '/thank-you');
      }).catch(function (error) {
        console.error(error);
        res.redirect ( '/thank-you');
      });
      

    //res.redirect ( '../');
} );

app.use( (req, res )  => res.status(404).render( '404' ) );

app.use( (err, req, res, next )  => res.status(500).render( '500' ) );

app.use( (req, res)  => res.render( 'thank-you' ) );


app.listen ( port, console.log( `http://127.0.0.1:${port}`) )