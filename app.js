const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("static"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",function(req,res){
    const firstName = req.body.firstname;
    const lastName = req.body.lastname;
    const emaiId = req.body.emailid;
    const data = {
        members: [
            {
                email_address: emaiId,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us12.api.mailchimp.com/3.0/lists/";
    const option = {
        method: "POST",
        auth: "sandy:"
    };
    const request = https.request(url,option,function(response){
        const responseCode = response.statusCode;
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
        console.log(responseCode);
        if(responseCode == 200){
            res.sendFile(__dirname+"/success.html");
        } else {
            res.sendFile(__dirname+"/failure.html");
        }
    });
    request.write(jsonData);
    request.end();
});

app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,function(){
    console.log("Server Started");
});


// 579a44f2011728f92d39df19680ecd45-us12

// 05167e348e