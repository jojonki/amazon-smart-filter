"use strict";

function filterProducts(filter) {
  let option_list = [
    "show_time_sale",
    "show_coupon",
    "show_discount",
    "show_sponsor",
    "enable_associate",
  ];
  chrome.storage.sync.get(option_list, function (items) {
    let products = this.document.getElementsByClassName("s-result-item");
    for (let i = 0; i < products.length; i++) {
      let p = products[i];
      if (p.getAttribute("data-asin") !== "") {
        p = p.getElementsByClassName("a-section")[0];
        if (p !== undefined) {
          let p_title_dom = p.getElementsByClassName("a-text-normal")[0];
          if (p_title_dom !== undefined) {
            // console.log('title: ' + p_title_dom.textContent.substr(0, 20));

            let time_sale_flag = false;
            let badge_text = p.getElementsByClassName("a-badge-text")[0];
            if (badge_text !== undefined) {
              time_sale_flag = badge_text.textContent == "タイムセール";
            }

            let discount_flag = false;
            let text_dom = p.getElementsByClassName("a-text-price")[0];
            if (text_dom !== undefined) {
              discount_flag =
                text_dom.getAttribute("data-a-strike") != undefined;
            }

            let coupon_flag =
              p.getElementsByClassName("s-coupon-unclipped")[0] !== undefined;

            let sponsor_flag = false;
            let may_sponsor_dom =
              p.getElementsByClassName("a-color-secondary")[0];
            if (
              may_sponsor_dom !== undefined &&
              may_sponsor_dom.textContent == "スポンサー"
            ) {
              sponsor_flag = true;
            }

            if (items.enable_associate) {
              let link_list = document.getElementsByClassName("a-link-normal");
              for (let j = 0; j < link_list.length; j++) {
                let cur_url = link_list[j].href;
                if (sponsor_flag) {
                  cur_url = cur_url.split("url=")[1];
                  if (cur_url !== undefined && cur_url.length > 0) {
                    cur_url = cur_url.split("%2Fref")[0];
                  }
                  if (
                    cur_url !== undefined &&
                    !cur_url.endsWith("tag=jonki-22")
                  ) {
                    link_list[j].setAttribute(
                      "href",
                      unescape(cur_url) + "?tag=jonki-22"
                    );
                  }
                } else {
                  if (
                    cur_url !== undefined &&
                    !cur_url.endsWith("tag=jonki-22")
                  ) {
                    link_list[j].setAttribute(
                      "href",
                      cur_url + "&tag=jonki-22"
                    );
                  }
                }
              }
            }

            if (filter) {
              if (sponsor_flag) {
                if (items.show_sponsor) {
                  // pass
                } else {
                  products[i].style.display = "none";
                }
              } else if (time_sale_flag && items.show_time_sale) {
                // pass
              } else if (coupon_flag && items.show_coupon) {
                // pass
              } else if (discount_flag && items.show_discount) {
                // pass
              } else {
                products[i].style.display = "none";
              }
            } else {
              // recover visibility
              if (products[i].style.display == "none") {
                products[i].style.display = "block";
              }
            }
          }
        }
      }
    }
  });
}

// Listen for messages
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.command) {
    // toggle
    if (msg.command == "notify_command") {
      chrome.storage.sync.get(["filter"], function (items) {
        let filter = !items.filter;
        document.getElementById("togBtn").checked = filter;
        filterProducts(filter);
        chrome.storage.sync.set({ filter: filter }, function (items) {});
      });
    } else if (msg.command == "notify_loaded_page") {
      chrome.storage.sync.get(["filter"], function (items) {
        filterProducts(items.filter);
      });
    } else if (msg.command == "notify_history_state_updated") {
      chrome.storage.sync.get(["filter"], function (items) {
        filterProducts(items.filter);
      });
    }
  }
});

function applyFilter() {
  chrome.storage.sync.get(["filter"], function (items) {
    let filter = items.filter;
    let checked_status = "";
    if (filter) {
      checked_status = 'checked="checked"';
    } else {
    }
    let dom =
      '<label class="switch"><input type="checkbox"  ' +
      checked_status +
      ' id = "togBtn"> <div class="slider round"></div></label> ';
    document.getElementById("nav-search").insertAdjacentHTML("beforeend", dom);
    document.getElementById("togBtn").addEventListener("click", function () {
      let filter = this.checked;
      chrome.storage.sync.set({ filter: filter }, function () {
        filterProducts(filter);
      });
    });

    filterProducts(filter);
  });
}
window.addEventListener(
  "load",
  function load(event) {
    window.removeEventListener("load", load, false); //remove listener, no longer needed
    applyFilter();

    return;
  },
  false
);
