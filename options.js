// Saves options to chrome.storage
let option_list = [
    'show_time_sale',
    'show_coupon',
    'show_discount',
    'show_sponsor',
];

function save_options() {
    let opts = {}
    for (let i = 0; i < option_list.length; i++) {
        opts[option_list[i]] = document.getElementById(option_list[i]).checked;
    }
    chrome.storage.sync.set(opts, function () {
        console.log('Option saved');
    });

    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
        status.textContent = '';
    }, 750);
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get(option_list, function (items) {
        for (let i = 0; i < option_list.length; i++) {
            let opt = option_list[i];
            document.getElementById(opt).checked = items[opt];
        }
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);