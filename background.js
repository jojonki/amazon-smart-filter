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
// // Listen events for url changes
// chrome.tabs.onUpdated.addListener(
//     function (tabId, changeInfo, tab) {
//         console.log('onUpdated:');
//         console.log(changeInfo);

//         if (changeInfo.status == 'complete') {
//             if ("url" in changeInfo) {
//                 // alert(changeInfo.url);
//                 console.log('complete');
//                 if (changeInfo.url.startsWith("https://www.amazon.co.jp/")) {
//                     console.log('send message');
//                     chrome.tabs.sendMessage(tab.id, {
//                         command: "notify_checker_result",
//                         // eval_list: eval_list,
//                         // checker_url: this.url
//                     });

//                 }

//             }
//         }
//     }
// );
