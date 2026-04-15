var acc = document.getElementsByClassName("accordion");
var i;
for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var panel = this.nextElementSibling;
        var icon = this.firstElementChild;
        if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
        } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}
var swiper = new Swiper(".swiper-container", { observer: true, observeParents: true, slidesPerView: 3, spaceBetween: 5, freeMode: true,autoplay: {
    delay: 2500,  reverseDirection: true
  } });
var bindex = 0;
var savedProductCount = 0;
var savedCategoryCount = 0;
var lastSelection = "";
var adtrack = "";
var mtrack = "";
var ctrack = "";
var ptrack = "";
var btrack = "";
var minScroll = document.getElementsByClassName("menu")[0].dataset.minscroll;
var lastScroll = 0;
var modalRecDisplayCount = 0;
var slideInRecDisplayCount = 0;
var calloutDisplayCount = 0;
var currentSidebarAdIndex = 0;
var currentSlideInAdIndex = 0;
const maxCalloutDisplay = 1;
const debounce = (func, delay) => {
    let inDebounce;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(inDebounce);
        inDebounce = setTimeout(() => func.apply(context, args), delay);
    };
};
const products = document.querySelectorAll(".product");
const categories = document.querySelectorAll(".pCategory");
const delay = parseInt(document.getElementsByClassName("menu")[0].dataset.sstopwait);
const viewportHeight = window.innerHeight || document.documentElement.clientHeight || body.clientHeight;
const nontriggeredrecommendations = document.querySelectorAll("[data-rectrigger='0']");
const menuSectionTriggeredRecommendations = document.querySelectorAll("[data-rectrigger='5']");
const categoryTriggeredRecommendations = document.querySelectorAll("[data-rectrigger='3']");
const productIPointFocusTriggeredRecommendations = document.querySelectorAll("[data-rectrigger='6']");
const maxModalRecDisplay = document.getElementsByClassName("menu")[0].dataset.modalrecmax;
const maxSlideInRecDisplay = document.getElementsByClassName("menu")[0].dataset.slideinrecmax;
const maxProducts = 3;
const maxCategories = 3;
var $menu = $(".menu");
var $firstMenu = $menu.first();
var iPointId = $firstMenu.data("ipoint");
var langcode = $firstMenu.data("lang");
var userAgent = navigator.userAgent;
var osPattern = /(Android|iPhone OS|iPad OS|Windows Phone|Windows NT|Linux|Mac OS X)/i;
var matches = userAgent.match(osPattern);
var operatingSystem = matches ? matches[0] : "NA";
window.addEventListener(
    "scroll",
    debounce(function () {
        checkSessionGetFocusedMenuItems();
    }, delay),
    false
);
$(document).on("pagecreate", function () {
    $(".sideBarMenuOpenTrigger").on("tap click", function (event, data) {
        var menuId = $(this).closest(".main").find("ul").data("menuidentifier");
        var sideMenuId = "SideMenu" + menuId;
        var iPointId = $(this).data("mipoint");
        event.stopPropagation();
        event.preventDefault();
        openMenuSideBarWithId(sideMenuId);
    });
    $(".menuSideBarLink").on("tap click", function (event, data) {
        var menuId = $(this).closest(".main").find("ul").data("menuidentifier");
        var sideMenuId = "SideMenu" + menuId;
        var iPointId = $(this).data("mipoint");
        event.stopPropagation();
        event.preventDefault();
        openSideMenuWithId(sideMenuId);
    });
    $(".sideBarMenuCloseTrigger").on("tap click", function (event, data) {
        var sideMenuId = $(this).parent().attr("id");
        event.stopPropagation();
        event.preventDefault();
        closeMenuSideBarWithId(sideMenuId);
    });
    $(".sideBarScrollTrigger").on("tap click", function (event, data) {
        event.preventDefault();
        $(".menuSideBar").width(0);
        var scrollUnit = $(this).data("scrollunit");
        var categoryId = $(this).data("cbehaviourunit");
        var menuId = $(this).data("mbehaviourunit");
        var iPointId = $(this).data("mipoint");
        scrollType = "sidebar";
        scrollToAnchor(scrollUnit);
    });
    $(".swiperScrollTrigger").on("tap click", function (event, data) {
        event.preventDefault();
        var scrollUnit = $(this).data("scrollunit");
        var menuId = $(this).data("mbehaviourunit");
        var iPointId = $(this).data("mipoint");
        scrollType = "swiper";
        scrollToAnchor(scrollUnit);
    });
    $("#Callout").on($.modal.BEFORE_CLOSE, function (event, modal) {
        if ($(".introAudio").length > 0) {
            $(".introAudio").get(0).play();
        }
    });
    $(".recommendationLink").on("tap click", function (event, data) {
        event.preventDefault();
        var actionstep = $(this).data("actionstep");
        var actionUnit = $(this).parent().data("actionunit");
        var linkUnitType = $(this).parent().data("linkedunittype");
        var recId = $(this).parent().data("recid");
        var recType = $(this).parent().data("rectype");
        var recTriggerUnitId = $(this).parent().data("triggeredbyunitid").replace("%", "").replace("#", "");
        var actionTaken = 1;
        if (recType == 0) {
            $.modal.close();
        } else if (recType == 1) {
            $(this).parent().removeClass("scale-in-ver-top");
            $(this).parent().addClass("scale-out-ver-top");
        }
        if (actionstep == "scroll") {
            actionTaken = 2;
            scrollType = "rec";
            scrollToAnchor(actionUnit);
        } else if (actionstep == "popup" && actionUnit != 0) {
            actionTaken = 3;
            productDetailPopup(actionUnit);
        } else if (actionstep == "additemtobasket" && actionUnit != null && actionUnit != 0) {
            actionTaken = 4;
            addToBasket(actionUnit);
        }
        $.ajax({ type: "POST", url: "/Menu/SaveInteractionForRecommendation", data: { Id: recId, TriggerUnitId: recTriggerUnitId, RecActionType: actionTaken }, timeout: 10000 });
    });
    $("#ProductInfo").on("tap click", ".recommendationLink", function (event, data) {
        event.preventDefault();
        var actionstep = $(this).data("actionstep");
        var actionUnit = $(this).parent().data("actionunit");
        var linkUnitType = $(this).parent().data("linkedunittype");
        var recId = $(this).parent().data("recid");
        var recType = $(this).parent().data("rectype");
        var recTriggerUnitId = $(this).parent().data("triggeredbyunitid").replace("%", "").replace("#", "");
        var actionTaken = 1;
        if (actionstep == "additemtobasket" && actionUnit != null && actionUnit != 0) {
            actionTaken = 4;
            addToBasket(actionUnit);
        }
        $.ajax({ type: "POST", url: "/Menu/SaveInteractionForRecommendation", data: { Id: recId, TriggerUnitId: recTriggerUnitId, RecActionType: actionTaken }, timeout: 10000 });
    });
    $("body").on("tap click", ".adLink", function (event, data) {
        event.preventDefault();
        var adDiv = $(this).parent();
        var adId = adDiv.data("adid");
        var actionLink = adDiv.data("actionlink");
        var adType = adDiv.data("adtype");
        var interaction = { AdIPointId: adId, IntendedAction: 1, GuestIdString: langcode + "_" + operatingSystem };
        $.ajax({
            type: "POST",
            url: "https://ads.jacca.com/api/SaveAdInteraction",
            data: JSON.stringify(interaction),
            contentType: "application/json; charset=utf-8",
            timeout: 10000,
            success: function () {
                var link = document.createElement("a");
                link.href = actionLink;
                link.target = "_blank";
                link.click();
                if (adType == 0 || adType == 5) {
                    $.modal.close();
                } else if (adType == 1) {
                    adDiv.removeClass("scale-in-ver-top");
                    adDiv.addClass("scale-out-ver-top");
                }
            },
            error: function (xhr, textStatus, errorThrown) { },
        });
    });
});
function productDetailPopup(productId) {
    const productInfo = $("#ProductInfo");
    productInfo.empty();
    const link = $("#" + productId).children(0);
    productInfo.attr("value", productId);
    const isOrderPlacable = productInfo.data("isorderplacable");
    const addProduct = productInfo.data("addtobasket");
    let modalClass = "menuModal";
    link.find("div[class*='productImage']").each(function () {
        const copyImage = $(this).clone();
        copyImage.css("margin", "auto");
        copyImage.css("margin-top", copyImage.data("imgwidth") == "500" ? "0px" : "20px");
        copyImage.css("height", "500px");
        copyImage.css("width", copyImage.data("imgwidth") == "500" ? "500px" : "300px");
        copyImage.css("background-position", copyImage.data("imgwidth") == "500" ? "center" : "");
        copyImage.css("border-radius", copyImage.data("imgwidth") == "500" ? "8px 8px 0px 0px" : "8px");
        if (copyImage.data("imgwidth") == "500") {
            modalClass = "productInfoModal";
        }
        productInfo.append(copyImage);
    });
    link.find("div[class*='descColumn']").each(function () {
        const copyInfo = $(this).clone();
        copyInfo.css({ display: "initial", float: "unset", "text-align": "center" });
        copyInfo.addClass('mod-product-details');
        copyInfo.find("div[class*='itemDescription']").each(function () {
            $(this).css({ "padding-left": "15px", "padding-right": "15px", overflow: "unset", "text-overflow": "unset", display: "block", "-webkit-line-clamp": "unset", "-webkit-box-orient": "unset", color: "unset" });
        });            
        copyInfo.find("div[class*='itemExtraInfo']").each(function () {
            $(this).css({ "justify-content": "center", "flex-direction": "row-reverse" });
        });
        copyInfo.find("div[class*='itemPrice']").each(function () {
            $(this).css({ position: "unset", color: "unset" });
        });
        copyInfo.find("div[class*='allergen']").css("display", "block");
        copyInfo.find("div[class*='allergenList']").each(function () {
            $(this).css({ display: "flex", "align-items": "flex-start", "margin-top": "20px" });
        });
        productInfo.append(copyInfo);
    });
    if (isOrderPlacable === "True") {
        productInfo.append('<div class="button orange addToBasketModal" style="width:100%;">' + addProduct + "</div>");
    }
    productInfo.modal({ fadeDuration: 250, modalClass: modalClass });
   
    triggerRecommendationsByProductIPointFocus(productId);
}
var getPreviousSibling = function (elem, selector) {
    var sibling = elem.previousElementSibling;
    if (!selector) return sibling;
    while (sibling) {
        if (sibling.matches(selector)) return sibling;
        sibling = sibling.previousElementSibling;
    }
};
var isInViewport = function (elem) {
    const bounding = elem.getBoundingClientRect();
    var top = parseInt(document.getElementsByClassName("menu")[0].dataset.ctop);
    return bounding.top >= top && bounding.left >= 0 && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) && bounding.right <= (window.innerWidth || document.documentElement.clientWidth);
};
var isSectionInFocus = function (elem) {
    const bounding = elem.getBoundingClientRect();
    var focuslimit = parseInt(document.getElementsByClassName("menu")[0].dataset.mfocus);
    return bounding.top >= 0 && bounding.left >= 0 && bounding.bottom <= focuslimit && bounding.right <= (window.innerWidth || document.documentElement.clientWidth);
};
var checkSessionGetFocusedMenuItems = function () {

};
function getFocusedMenuItems() {
    var sideBar = document.getElementsByClassName("menuSideBar")[0];
    var searchBarFilteredItems = document.getElementsByClassName("ui-screen-hidden");
    var isRecFound = 0;
    var isCategoryFound = 0;
    var productsSavedInSingleCheck = 0;
    var productSelection = "";
    var sLength = Math.abs(window.scrollY - lastScroll);
    if (sideBar.style.width != "100%" && searchBarFilteredItems.length == 0 && bindex > 0 && ((bindex <= 50 && sLength > minScroll) || (bindex <= 2 && sLength <= minScroll))) {
        displaySlideinAd();
        for (let r = 0; r < nontriggeredrecommendations.length; r++) {
            if (isRecFound == 0) {
                if (isInViewport(nontriggeredrecommendations[r])) {
                    isRecFound = 1;
                    if (btrack.match(nontriggeredrecommendations[r].dataset.recid) == null) {
                        displayRecommendation(nontriggeredrecommendations[r].dataset.recid);
                        btrack = btrack + "#" + nontriggeredrecommendations[r].dataset.recid + "%";
                    }
                }
            }
        }
        for (let c = 0; c < categories.length; c++) {
            if (isCategoryFound == 0) {
                if (isSectionInFocus(categories[c])) {
                    isCategoryFound = 1;
                    if (ctrack.match(categories[c].dataset.cbehaviourunit) == null && savedCategoryCount < maxCategories) {
                        saveSFocusedMenuCategory(categories[c].dataset.cbehaviourunit, categories[c].dataset.mbehaviourunit, categories[c].dataset.mipoint);
                        ctrack = ctrack + "#" + categories[c].dataset.cbehaviourunit + "%";
                        savedCategoryCount = savedCategoryCount + 1;
                    }
                    if (categoryTriggeredRecommendations != null && categoryTriggeredRecommendations.length > 0) {
                        var isCRecFound = triggerRecommendationByCategory("#" + categories[c].dataset.cbehaviourunit + "%");
                    } else {
                        var isCRecFound = false;
                    }
                    if (menuSectionTriggeredRecommendations != null && menuSectionTriggeredRecommendations.length > 0 && isCRecFound == false) {
                        triggerRecommendationByMenuSection("#" + categories[c].dataset.mbehaviourunit + "%");
                    }
                }
            } else {
                break;
            }
        }
        for (let p = 0; p < products.length; p++) {
            if (productsSavedInSingleCheck < 1) {
                if (ptrack.match("#" + products[p].id + "%") == null && isInViewport(products[p])) {
                    if (isCategoryFound == 0) {
                        var category = getPreviousSibling(products[p], ".pCategory");
                        if (category != null) {
                            isCategoryFound = 1;
                            if (ctrack.match(category.dataset.cbehaviourunit) == null && savedCategoryCount < maxCategories) {
                                saveSFocusedMenuCategory(category.dataset.cbehaviourunit, category.dataset.mbehaviourunit, category.dataset.mipoint);
                                ctrack = ctrack + "#" + category.dataset.cbehaviourunit + "%";
                                savedCategoryCount = savedCategoryCount + 1;
                            }
                            if (categoryTriggeredRecommendations != null && categoryTriggeredRecommendations.length > 0) {
                                var isCRecFound = triggerRecommendationByCategory("#" + category.dataset.cbehaviourunit + "%");
                            } else {
                                var isCRecFound = false;
                            }
                            if (menuSectionTriggeredRecommendations != null && menuSectionTriggeredRecommendations.length > 0 && isCRecFound == false) {
                                triggerRecommendationByMenuSection("#" + category.dataset.mbehaviourunit + "%");
                            }
                        }
                    }
                    productSelection = productSelection + "#" + products[p].id + "%";
                    productsSavedInSingleCheck = productsSavedInSingleCheck + 1;
                }
            } else {
                break;
            }
        }
        if (savedProductCount < maxProducts) {
            saveSFocusedProducts(productSelection);
            ptrack = ptrack + productSelection;
            savedProductCount = savedProductCount + 1;
        }
    }
    bindex = bindex + 1;
    lastScroll = window.scrollY;
}
function openMenuSideBarWithId(sideMenuId) {
    displaySidebarAd();
    document.getElementById(sideMenuId).style.width = "100%";
}
function closeMenuSideBarWithId(sideMenuId) {
    document.getElementById(sideMenuId).style.width = "0";
    tryDisplayingACallout();
}
function scrollToAnchor(item) {
    var aTag = $("span[id='" + item + "']");
    $("html,body").animate({ scrollTop: aTag.offset().top }, "slow");
}
function saveSFocusedMenuCategory(categoryId, menuId, iPointId) {
    $.ajax({ type: "POST", url: "/Menu/SaveBehaviourForScrollStop", data: { Id: categoryId, MenuId: menuId, IPointId: iPointId }, timeout: 10000 });
}
function saveSFocusedProducts(productSelection) {
    $.ajax({ type: "POST", url: "/Menu/SaveViewedIPTMenuProductIPointForScrollStop", data: { ProductSelection: productSelection }, timeout: 10000 });
}
function triggerRecommendationByCategory(categoryTrace) {
    var isRecommendationFound = 0;
    var triggerUnitTrace = "";
    var activeSlideIns = document.getElementsByClassName("scale-in-ver-top").length;
    var result = false;
    if (categoryTrace != null && categoryTrace != "" && $.modal.isActive() == false && activeSlideIns == 0) {
        for (let r = 0; r < categoryTriggeredRecommendations.length; r++) {
            if (isRecommendationFound == 0) {
                if (categoryTriggeredRecommendations[r].dataset.trunit.match(categoryTrace) != null) {
                    triggerUnitTrace = categoryTriggeredRecommendations[r].dataset.trunit;
                    triggerUnitTrace = triggerUnitTrace.replace(categoryTrace, "");
                    isRecommendationFound = 1;
                    recommendationId = categoryTriggeredRecommendations[r].dataset.recid;
                    categoryTriggeredRecommendations[r].setAttribute("data-trunit", triggerUnitTrace);
                    categoryTriggeredRecommendations[r].setAttribute("data-triggeredbyunitid", categoryTrace);
                    displayRecommendation(recommendationId);
                    result = true;
                }
            } else {
                break;
            }
        }
    }
    return result;
}
function triggerRecommendationByMenuSection(menuSectionTrace) {
    var isRecommendationFound = 0;
    var trgUnitTrace = "";
    var activeSlideInCount = document.getElementsByClassName("scale-in-ver-top").length;
    if (menuSectionTrace != null && menuSectionTrace != "" && $.modal.isActive() == false && activeSlideInCount == 0) {
        for (let r = 0; r < menuSectionTriggeredRecommendations.length; r++) {
            if (isRecommendationFound == 0) {
                if (menuSectionTriggeredRecommendations[r].dataset.trunit.match(menuSectionTrace) != null) {
                    trgUnitTrace = menuSectionTriggeredRecommendations[r].dataset.trunit;
                    trgUnitTrace = trgUnitTrace.replace(menuSectionTrace, "");
                    isRecommendationFound = 1;
                    recommendationId = menuSectionTriggeredRecommendations[r].dataset.recid;
                    menuSectionTriggeredRecommendations[r].setAttribute("data-trunit", trgUnitTrace);
                    menuSectionTriggeredRecommendations[r].setAttribute("data-triggeredbyunitid", menuSectionTrace);
                    displayRecommendation(recommendationId);
                }
            } else {
                break;
            }
        }
    }
}
function triggerRecommendationsByProductIPointFocus(productId) {
    var productTrace = "#" + productId + "%";
    var listTitle = $("#ProductInfo").data("pfr2title");
    var isRecommendationFound = 0;
    var triggeredRecommendationId = "";
    if (productIPointFocusTriggeredRecommendations.length > 0) {
        for (let r = 0; r < productIPointFocusTriggeredRecommendations.length; r++) {
            if (isRecommendationFound == 0) {
                if (productIPointFocusTriggeredRecommendations[r].dataset.trunit.match(productTrace) != null) {
                    isRecommendationFound = 1;
                    $("#ProductInfo").append('<div class="productfocusRecHeadline">' + listTitle + "</div>");
                }
            } else {
                break;
            }
        }
        if (isRecommendationFound == 1) {
            for (let r = 0; r < productIPointFocusTriggeredRecommendations.length; r++) {
                if (productIPointFocusTriggeredRecommendations[r].dataset.trunit.match(productTrace) != null) {
                    triggeredRecommendationId = productIPointFocusTriggeredRecommendations[r].dataset.recid;
                    productIPointFocusTriggeredRecommendations[r].setAttribute("data-triggeredbyunitid", productTrace);
                    displayRecommendation(triggeredRecommendationId);
                }
            }
        }
    }
}
function displayRecommendation(disRecId) {
    var recommendations = document.querySelectorAll("[data-recid='" + disRecId + "']");
    var rec = recommendations[0];
    var recType = rec.dataset.rectype;
    var recDisplayTime = rec.dataset.displaytime;
    var recTriggerUnitId = rec.dataset.triggeredbyunitid.replace("%", "").replace("#", "");
    if (rec.dataset.hasOwnProperty("adid")) {
        var interaction = { AdIPointId: rec.dataset.adid, IntendedAction: 0, GuestIdString: langcode + "_" + operatingSystem };
        $.ajax({ type: "POST", url: "https://ads.jacca.com/api/SaveAdInteraction", data: JSON.stringify(interaction), contentType: "application/json; charset=utf-8", timeout: 10000, error: function (xhr, textStatus, errorThrown) { } });
    } else {
        $.ajax({ type: "POST", url: "/Menu/SaveInteractionForRecommendation", data: { Id: disRecId, TriggerUnitId: recTriggerUnitId, RecActionType: 0 }, timeout: 10000 });
    }
    if (recType == 0 && modalRecDisplayCount < maxModalRecDisplay) {
        $(rec).modal({ fadeDuration: 250 });
        modalRecDisplayCount = modalRecDisplayCount + 1;
        if (recDisplayTime != null && recDisplayTime > 0) {
            setTimeout(function () {
                if ($.modal.isActive()) {
                    $.ajax({ type: "POST", url: "/Menu/SaveInteractionForRecommendation", data: { Id: disRecId, TriggerUnitId: recTriggerUnitId, RecActionType: 1 }, timeout: 10000 });
                    $.modal.close();
                }
            }, recDisplayTime);
        }
    } else if (recType == 1 && slideInRecDisplayCount < maxSlideInRecDisplay) {
        $(rec).addClass("scale-in-ver-top");
        $(rec).css("display", "");
        $(rec).removeClass("scale-out-ver-top");
        slideInRecDisplayCount = slideInRecDisplayCount + 1;
        if (recDisplayTime != null && recDisplayTime > 0) {
            setTimeout(function () {
                if ($(".scale-in-ver-top").length > 0) {
                    $.ajax({ type: "POST", url: "/Menu/SaveInteractionForRecommendation", data: { Id: disRecId, TriggerUnitId: recTriggerUnitId, RecActionType: 1 }, timeout: 10000 });
                    $(rec).removeClass("scale-in-ver-top");
                    $(rec).addClass("scale-out-ver-top");
                }
            }, recDisplayTime);
        }
    } else if (recType == 2) {
        var copyRec = $(rec).clone();
        $(copyRec).css("display", "flex");
        $(copyRec).css("border-bottom", "0.5px solid #c5c5c5");
        $("#ProductInfo").append($(copyRec));
    }
}
function getMenuAds(iPointId, langCode, isBasketLoaded) {
    const isSideBarOpen = $(".menuSideBar").length > 0 && $(".menuSideBar")[0].classList.contains("openAtStart");
    $.ajax({
        url: "https://ads.jacca.com/api/GetAds",
        method: "GET",
        data: { IPointId: iPointId, LangCode: langCode },
        success: function (response) {
            const adItems = response.items;
            if (adItems.length > 0) {
                $.each(adItems, function (index, adItem) {
                    if (adItem.LinkedRecIPointId != null) {
                        const $connectedRecommendation = $('[data-recid="' + adItem.LinkedRecIPointId + '"]');
                        if ($connectedRecommendation.length > 0) {
                            linkAdToRecommendation(adItem, $connectedRecommendation);
                        }
                    } else {
                        const $adTypeContainer = $("#adtypecontainer-" + adItem.AdClass);
                        if ($adTypeContainer.length > 0) {
                            const newAd = createAd(adItem);
                            $adTypeContainer.append(newAd);
                        }
                    }
                });
            }
            performInitializedMenuActions(isSideBarOpen, isBasketLoaded);
        },
        error: function (xhr, status, error) {
            console.log("Error retrieving ad data:", error);
            performInitializedMenuActions(isSideBarOpen, isBasketLoaded);
        },
    });
}
function performInitializedMenuActions(isSideBarOpen, isBasketLoaded) {
    if (isSideBarOpen) {
        displaySidebarAd();
    } else if (!isBasketLoaded) {
        tryDisplayingACallout();
    }
}
function tryDisplayingACallout() {
    if (calloutDisplayCount < maxCalloutDisplay) {
        if ($("#adtypecontainer-callout").children().length > 0) {
            displayCalloutAd();
        } else if ($("#CalloutRec").length > 0) {
            var calloutRec = $("#CalloutRec");
            if (!sideBar.classList.contains("openAtStart") && btrack.match(calloutRec.data("recid")) === null) {
                displayRecommendation(calloutRec.data("recid"));
                btrack = btrack + "#" + calloutRec.data("recid") + "%";
            }
        } else if ($("#Callout").length > 0) {
            $("#Callout").modal({ fadeDuration: 250, closeClass: "icon-remove", closeText: "X" });
        }
        calloutDisplayCount = calloutDisplayCount + 1;
    }
}
function createAd(adItem) {
    const $adDiv = $("<div>")
        .addClass(adItem.AdClass)
        .css({ display: "none", width: adItem.Width + "px", height: adItem.Height + "px" })
        .attr("data-adid", adItem.Id)
        .attr("data-adtype", adItem.AdType)
        .attr("data-displaytime", adItem.AdDisplayTime)
        .attr("data-actionlink", adItem.Actionlink || "");
    if (adItem.ImageUrl && adItem.ImageUrl.trim() !== "") {
        $adDiv.css({ "background-image": "url(" + adItem.ImageUrl + ")", "background-repeat": adItem.BackgroundRepeat, "background-size": adItem.BackgroundSize });
    } else {
        $adDiv.css("background-color", adItem.BackgroundColor);
    }
    const $dynamicAdLink = createAdLink(adItem);
    $adDiv.append($dynamicAdLink);
    return $adDiv[0].outerHTML;
}
function linkAdToRecommendation(adItem, $connectedRecommendation) {
    $connectedRecommendation
        .attr("data-adid", adItem.Id)
        .attr("data-adtype", adItem.AdType)
        .attr("data-displaytime", adItem.AdDisplayTime)
        .empty()
        .css({ width: adItem.Width + "px", height: adItem.Height + "px" })
        .attr("data-actionlink", adItem.Actionlink || "");
    if (adItem.ImageUrl && adItem.ImageUrl.trim() !== "") {
        $connectedRecommendation.css({ "background-image": "url(" + adItem.ImageUrl + ")", "background-repeat": adItem.BackgroundRepeat, "background-size": adItem.BackgroundSize });
    } else {
        $connectedRecommendation.css("background-color", adItem.BackgroundColor);
    }
    const $dynamicAdLink = createAdLink(adItem);
    $connectedRecommendation.append($dynamicAdLink);
}
function createAdLink(adItem) {
    const $adLink = $("<a>").attr("href", "#").addClass("adLink");
    const $adContent = $("<div>").addClass(adItem.CClass);
    $adLink.append($adContent);
    if (adItem.Title != null && adItem.Title.trim() !== "") {
        const $adTitleContainer = $("<div>")
            .text(adItem.Title)
            .addClass(adItem.TitleContainerClass)
            .css({ background: adItem.TitleBackground, "font-family": adItem.TitleFontFamily, "font-size": adItem.TitleFontSize + "px", color: adItem.TitleTextColor });
        $adContent.append($adTitleContainer);
    }
    return $adLink[0].outerHTML;
}
function displayCalloutAd() {
    var adDivs = $("#adtypecontainer-callout").find("div.callout");
    var idAdShown = false;
    adDivs.each(function () {
        if (idAdShown) {
            return false;
        }
        var adDiv = $(this);
        var adDisplayDuration = adDiv.data("displaytime");
        if (adDiv.data("adid")) {
            var currentAdTrack = "%" + adDiv.data("adid") + "#";
            if (!adtrack.includes(currentAdTrack)) {
                var interaction = { AdIPointId: adDiv.data("adid"), IntendedAction: 0, GuestIdString: langcode + "_" + operatingSystem };
                $.ajax({
                    type: "POST",
                    url: "https://ads.jacca.com/api/SaveAdInteraction",
                    data: JSON.stringify(interaction),
                    contentType: "application/json; charset=utf-8",
                    timeout: 10000,
                    error: function (xhr, textStatus, errorThrown) { },
                });
                adtrack += currentAdTrack;
                idAdShown = true;
            }
        } else {
            return false;
        }
    });
}
function displaySidebarAd() {
    var adDivs = $("#adtypecontainer-sidebar").find("div.sidebar");
    if (adDivs.length > 0) {
        adDivs.css("display", "none");
        var currentAd = adDivs.eq(currentSidebarAdIndex);
        var currentAdTrack = "%" + currentAd.data("adid") + "#";
        currentSidebarAdIndex++;
        if (currentSidebarAdIndex >= adDivs.length) {
            currentSidebarAdIndex = 0;
        }
        if (!adtrack.includes(currentAdTrack)) {
            var interaction = { AdIPointId: adDiv.data("adid"), IntendedAction: 0, GuestIdString: langcode + "_" + operatingSystem };
            $.ajax({ type: "POST", url: "https://ads.jacca.com/api/SaveAdInteraction", data: JSON.stringify(interaction), contentType: "application/json; charset=utf-8", timeout: 10000, error: function (xhr, textStatus, errorThrown) { } });
            adtrack += currentAdTrack;
        }
    }
}
function displaySlideinAd() {
    var adDivs = $("#adtypecontainer-slidein").find("div.slidein");
    if (adDivs.length > 0 && currentSlideInAdIndex < adDivs.length) {
        adDivs.css("display", "none");
        var currentAd = adDivs.eq(currentSlideInAdIndex);
        var adDisplayDuration = currentAd.data("displaytime");
        var currentAdTrack = "%" + currentAd.data("adid") + "#";
        var activeSlideIns = document.getElementsByClassName("scale-in-ver-top").length;
        if (!adtrack.includes(currentAdTrack) && activeSlideIns == 0 && $.modal.isActive() == false) {
            currentSlideInAdIndex++;
            var interaction = { AdIPointId: currentAd.data("adid"), IntendedAction: 0, GuestIdString: langcode + "_" + operatingSystem };
            $.ajax({ type: "POST", url: "https://ads.jacca.com/api/SaveAdInteraction", data: JSON.stringify(interaction), contentType: "application/json; charset=utf-8", timeout: 10000, error: function (xhr, textStatus, errorThrown) { } });
            adtrack += currentAdTrack;
        }
    }
}