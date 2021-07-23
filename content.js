// alert('content');
function toggleSalesVisibility() {
    let key = "visibility"
    let visibility = localStorage.getItem(key);
    if (visibility == 'show') {
        visibility = true;
    } else {
        visibility = false;
    }

    // this.document.title = 'aaa';
    let products = this.document.getElementsByClassName('s-result-item');
    for (let i = 0; i < products.length; i++) {
        let p = products[i];
        if (p.getAttribute('data-asin') !== '') {
            p = p.getElementsByClassName('a-section')[0];
            if (p !== undefined) {
                let p_title_dom = p.getElementsByClassName('a-text-normal')[0];
                if (p_title_dom !== undefined) {
                    // console.log('title: ' + p_title_dom.textContent.substr(0, 20));
                    let badge_text = p.getElementsByClassName('a-badge-text')[0];
                    let time_sale_flag = false;

                    if (badge_text !== undefined) {
                        // console.log('badge text;' + badge_text.textContent);
                        time_sale_flag = badge_text.textContent == 'タイムセール';
                    }
                    let price_down_flag = p.getElementsByClassName('a-text-price')[0] !== undefined;
                    let coupon_flag = p.getElementsByClassName('s-coupon-unclipped')[0] !== undefined;
                    // console.log(time_sale_flag + ', ' + price_down_flag);
                    let sponsor_flag = false;
                    let may_sponsor_dom = p.getElementsByClassName('a-color-secondary')[0];
                    if (may_sponsor_dom !== undefined && may_sponsor_dom.textContent == 'スポンサー') {
                        sponsor_flag = true;
                    }

                    if (visibility == false) {
                        if (sponsor_flag) {
                            products[i].style.display = 'none';
                        } else if (time_sale_flag || price_down_flag || coupon_flag) {
                            // pass
                        } else {
                            products[i].style.display = 'none';
                        }
                    } else {
                        if (products[i].style.display == 'none') {
                            products[i].style.display = 'block';
                        }
                    }
                }
            }
        }
    }
    document.getElementById("togBtn").checked = !visibility;
    if (visibility == true) {
        visibility = "hide";
    } else {
        visibility = "show";
    }
    localStorage.setItem(key, visibility);

}

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.command) {
        if (msg.command == "notify_command") {
            toggleSalesVisibility();
        }
    }
});

window.addEventListener("load", function load(event) {
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    // alert('hoge');
    //enter here the action you want to do once loaded 


    let dom = ' <label class="switch"><input type="checkbox" id="togBtn" onclick="toggleSalesVisibility()"><div class="slider round"></div></label>';
    document.getElementById('nav-search').insertAdjacentHTML("beforeend", dom);
    document.getElementById('togBtn').addEventListener('click', function () {
        toggleSalesVisibility();
    });
    return;

    this.document.title = 'hoge';
    let products = this.document.getElementsByClassName('s-result-item');
    // for (let i = 0; i < 10; i++) {
    for (let i = 0; i < products.length; i++) {
        let p = products[i];
        if (p.getAttribute('data-asin') !== '') {
            p = p.getElementsByClassName('a-section')[0];
            if (p !== undefined) {
                let p_title_dom = p.getElementsByClassName('a-text-normal')[0];
                if (p_title_dom !== undefined) {
                    // console.log('title: ' + p_title_dom.textContent.substr(0, 20));
                    let badge_text = p.getElementsByClassName('a-badge-text')[0];
                    let time_sale_flag = false;

                    if (badge_text !== undefined) {
                        // console.log('badge text;' + badge_text.textContent);
                        time_sale_flag = badge_text.textContent == 'タイムセール';
                    }
                    let price_down_flag = p.getElementsByClassName('a-text-price')[0] !== undefined;
                    let coupon_flag = p.getElementsByClassName('s-coupon-unclipped')[0] !== undefined;
                    // console.log(time_sale_flag + ', ' + price_down_flag);


                    if (time_sale_flag || price_down_flag || coupon_flag) {
                        // p.innerHTML = '<div>hoge</div>';
                    } else {
                        products[i].style.display = 'none';
                    }
                }
            }
        }
    }

}, false);