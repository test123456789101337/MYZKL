'use strict'
require('dotenv').config();
const JiraClient = require('jira-connector');
module.exports = ()=>{
var jira = new JiraClient( {
    host: '.atlassian.net',
    basic_auth: {
        username: 'kevin.omalley',
        password: process.env.JIRA_PASS
    }
});
jira.webhook.board.getAllBoards((data)=>{
    console.log(data);
});
jira.webhook.getWebhook((data)=>{
    console.log(data);
}).catch((error)=>{
    //console.log("Jira error "+error);
})}
//jira.board.getAllBoards({},console.log);}
//jira.getAllBoards()