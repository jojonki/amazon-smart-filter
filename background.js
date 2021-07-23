"use strict";
chrome.commands.onCommand.addListener(function (command) {
    console.log("onCommand:", command);

    if (command !== undefined) {
        chrome.tabs.query({
            active: true,
            lastFocusedWindow: true
        }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                command: "notify_command",
                // eval_list: eval_list,
                // checker_url: this.url
            });

        });
    }
});