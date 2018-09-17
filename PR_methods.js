/*
In order to package closed and merged pull requests while making the least possible
number of http requests, I have made algorithms that attach the commits from the push event that 
occurs immediately after the pull request into the pull_request object for easier data manipulation on the frontend and backend.

This is neccessairy because the pull request event does not contain the commits related to it in the pull request event JSON.

These methods serve as helpers in order to achieve this.

When the webhook hears the rull request event it adds the JSON data to an array called pullRequestsCache.
Then, it checks the array to see if there is a duplicate of the new pull request already cached, if so, it moves the
recently added JSON object from the end of the array to the index of the duplicate, deleting the duplicate at the same time.

Also, when the webhook hears a push event it checks to see if there is anything in the pullRequestCache array, if there is then
it checks the array to see if it can find a pull request with a merge_commit_sha that matches the SHA of the incoming push payload.
If it finds one then it will set the active_index to the index of that element in the array, and return true, if not it will
set the active_index to -1 and return false.

If true, it declares the temporary pull request object (pr_temp) to that element, and then sets the 'commits' property of the PR
to the 'commits' property of the incoming payload. 

Then the new pull_request object is emmitted.

Then, if there are more than 1 pull requests cached in the array, the array deletes the element at active_index and replaces it 
with the last element in the array, cleaning and trimming it. (grooming it for perfection!) :)

If the pullRequestCache array has only 1 element then that element is simply deleted, as it is no longer needed.

pr_temp is also set to null to save memory.

If there are no cached pull_requests or the push does not match the merge_commit_sha of the pull_request
then the push object is emitted normally.

Hooray for clean IO!
*/
var clientPush = require('./githubEvents.js').clientPush;
var pull_request = require('./githubEvents.js').pullRequest;

module.exports.setActiveIndex = setActiveIndex;
module.exports.getActiveIndex = getActiveIndex;
module.exports.setPR_Cache = setPR_Cache;
module.exports.getPR_Cache = getPR_Cache;
module.exports.process_PR = process_PR;

var pullRequestCache = new Array();
var pr_temp;
var active_index;

function setPR_Cache(element) {
    pr_temp = element;
}
function getPR_Cache(element) {
    return pr_temp;
}

function setActiveIndex(index) {
    active_index = index;
}
function getActiveIndex() {
    return active_index;
}
function findIndex(data) {
    active_index = pullRequestCache.findIndex((element) => {
        return element.merge_commit_sha == data.head_commit.id;
    })
    if (active_index >= 0) {
        return true;
    }
    return false;
}

class process_PR {
    //active_index=0;
    constructor(data) {
        var name;
        var payload;
        if (pullRequestCache.length > 0) {

            if (findIndex(data)) { //if findIndex() finds an element that matches the predicate,
                //set active_index to the index of that pull request and return true,
                //otherwise set active_index to -1 and return false 

                payload = pullRequestCache[active_index];
                console.log(pr_temp)
                payload.commits = new clientPush(data).commits;
                name = 'pull_request';
                // this.io.emit("test", pr_temp);


                if (pullRequestCache.length > 1) {

                    pullRequestCache.splice(active_index, 1, pullRequestCache.pop());
                    //removes the pull request from the array and replaces it with the last element in the array
                }
                else {
                    pullRequestCache.pop();
                }

                pr_temp = null;

            }
            console.log({ pullRequestCache }, pullRequestCache.length);

        }
        else {
            payload = new clientPush(data);
            name = 'push';
            //pull_request=false;
            // this.io.emit("push", new clientPush(data));

        }
        return { name: name, payload: payload };
    }

}