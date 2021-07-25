"use strict";
chrome.commands.onCommand.addListener(function (command) {
    if (command == 'sale-filter-toggle') {
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

chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        let opts = {
            'show_time_sale': true,
            'show_coupon': true,
            'show_discount': true,
            'show_sponsor': false,
            'enable_associate': true,
        };
        chrome.storage.sync.set(opts, function () {
            chrome.runtime.openOptionsPage();
        });
    } else if (details.reason == "update") {
        // var thisVersion = chrome.runtime.getManifest().version;
        // console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
    }
});

var amazon_update_ts = 0;
var amazon_update_detect = false;
chrome.webNavigation.onHistoryStateUpdated.addListener((obj) => {
    if (obj.url.startsWith('https://www.amazon')) {
        amazon_update_detect = true;
        amazon_update_ts = obj.timeStamp;
    }
});

chrome.webNavigation.onCompleted.addListener((obj) => {
    if (amazon_update_detect && obj.timeStamp - amazon_update_ts < 1000) {
        amazon_update_detect = false
        chrome.tabs.sendMessage(obj.tabId, {
            command: "notify_history_state_updated",
        });
    }
    amazon_update_ts = obj.timeStamp;
});