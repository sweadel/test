$(document).on("pagecreate", function () {
    $(".disableDoubleClick").on("click", function (e) {
        $("#screenLockMask").show();
    });
    $("#screenLockMask").hide();
    $("#checkbox-with-link label a").on("tap click", function (event, data) {
        event.stopPropagation();
        window.location.href = $(this).attr("href");
    });
    $(".rating #slider").change(function () {
        $(".rating .score big").html($(this).val());
        $(".rating .messages li.selected").removeClass("selected");
        $(".rating .messages li:eq(" + $(this).val() + ")").addClass("selected");
    });
    $(".review .votes .vote").on("click", function () {
        var formId = $(this).closest("form").data("formidentifier");
        var i = parseInt(
            $(this)
                .attr("id")
                .replace(formId + "_", "")
        );
        $(".message").css("color", "#5a5a5a");
        $(".review .votes .vote").removeClass("active");
        $(this).addClass("active");
        $(".review .votes .vote").removeClass("ticked");
        console.log(i);
        var activeIcon;
        if (i == 1) activeIcon = "icon-sad";
        if (i == 2) activeIcon = "icon-neutral";
        if (i == 3) activeIcon = "icon-happy";
        if (i == 4) activeIcon = "icon-very-happy";
        $(".review .votes .vote").removeClass("icon-sad").removeClass("icon-neutral").removeClass("icon-very-happy").removeClass("icon-happy");
        var messageHtml = $(".interrate" + i + "").html();
        $(".review .message").html(messageHtml);
        $(".ratingValue").val(i);
        $("#" + formId + "_1").addClass("icon-sad");
        $("#" + formId + "_2").addClass("icon-neutral");
        $("#" + formId + "_3").addClass("icon-happy");
        $("#" + formId + "_4").addClass("icon-very-happy");
        for (var a = 1; a <= i; a++) {
            $("#" + formId + "_" + a)
                .removeClass("icon-sad")
                .removeClass("icon-neutral")
                .removeClass("icon-very-happy")
                .removeClass("icon-happy")
                .addClass(activeIcon)
                .addClass("ticked");
        }
    });
    $(".sendRating").submit(function () {
        var formidentifier = $(this).data("formidentifier");
        var value = $(this).children(".ratingValue").val();
        var dynamicAnswerLevels = $(this).children(".dynamicAnswerLevels").val();
        var ratingAnswerId = $(this).find("input[name=RatingAnswerId]").val();
        var email = $(this).find("input[name=Email]").val();
        var contact = $(this).find("input[name=ContactInfo]").val();
        var name = $(this).find("input[name=FullName]").val();
        var otherInfo = $(this).find("input[name=OtherInfo]").val();
        var marketingDataConsentType = $(this).find("input[name=ConsentType]").val();
        var verificationCode = $(this).find("input[name=VerificationCode]").val();
        var emailVerificationCode = $(this).find("input[name=EmailVerificationCode]").val();
        var paramToSend = "";
        $("#screenLockMask").show;
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var mo = /^[+]?[0-9]{9,14}$/;
        if (value == "0") {
            $(".message").css("color", "red");
            $("#screenLockMask").hide();
            return false;
        } else if (value > 4) {
            $(".ratingValue").val(0);
            var messageHtml = $(".interrate0").html();
            $(".review .message").html(messageHtml);
            $(".message").css("color", "red");
            $("#screenLockMask").hide();
            return false;
        }
        if (dynamicAnswerLevels != null) {
            if (ratingAnswerId == null || ratingAnswerId == "") {
                $("#DynamicAnswerError").css("display", "block");
                $("#screenLockMask").hide();
                return false;
            }
        }
        if (contact != null && contact != "") {
            $("#MandatoryMobileError").css("display", "none");
            if (verificationCode != null) {
                if (verificationCode == "") {
                    $("#VerificationCodeSent").css("display", "none");
                    $("#VerificationCodeError").css("display", "block");
                    $("#screenLockMask").hide();
                    return false;
                }
            } else if (mo.test(contact) != true) {
                $("#InvalidMobileError").css("display", "block");
                $("#screenLockMask").hide();
                return false;
            }
        }
        if (email != null && email != "") {
            var valid = re.test(email);
            $("#MandatoryEmailError").css("display", "none");
            if (emailVerificationCode != null) {
                if (emailVerificationCode == "") {
                    $("#EmailVerificationCodeSent").css("display", "none");
                    $("#EmailVerificationCodeError").css("display", "block");
                    $("#screenLockMask").hide();
                    return false;
                }
            } else if (re.test(email) != true) {
                $("#InvalidEmailError").css("display", "block");
                $("#screenLockMask").hide();
                return false;
            }
        }
        $("#screenLockMask").hide;
        $(this).hide;
        return true;
    });
    $(".sendRequestedInfo").submit(function () {
        var formidentifier = $(this).data("formidentifier");
        var dynamicAnswerLevels = $(this).children(".dynamicAnswerLevels").val();
        var ratingAnswerId = $(this).find("input[name=RatingAnswerId]").val();
        var email = $(this).find("input[name=Email]").val();
        var contact = $(this).find("input[name=ContactInfo]").val();
        var name = $(this).find("input[name=FullName]").val();
        var otherInfo = $(this).find("input[name=OtherInfo]").val();
        var marketingDataConsentType = $(this).find("input[name=ConsentType]").val();
        var verificationCode = $(this).find("input[name=VerificationCode]").val();
        var emailVerificationCode = $(this).find("input[name=EmailVerificationCode]").val();
        var paramToSend = "";
        $("#screenLockMask").show;
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var mo = /^[+]?[0-9]{9,14}$/;
        if (dynamicAnswerLevels != null) {
            if (ratingAnswerId == null || ratingAnswerId == "") {
                $("#DynamicAnswerError").css("display", "block");
                $("#screenLockMask").hide();
                return false;
            }
        }
        if (contact != null && contact != "") {
            $("#MandatoryMobileError").css("display", "none");
            if (verificationCode != null) {
                if (verificationCode == "") {
                    $("#VerificationCodeSent").css("display", "none");
                    $("#VerificationCodeError").css("display", "block");
                    $("#screenLockMask").hide();
                    return false;
                }
            } else if (mo.test(contact) != true) {
                $("#InvalidMobileError").css("display", "block");
                $("#screenLockMask").hide();
                return false;
            }
        }
        if (email != null && email != "") {
            var valid = re.test(email);
            $("#MandatoryEmailError").css("display", "none");
            if (emailVerificationCode != null) {
                if (emailVerificationCode == "") {
                    $("#EmailVerificationCodeSent").css("display", "none");
                    $("#EmailVerificationCodeError").css("display", "block");
                    $("#screenLockMask").hide();
                    return false;
                }
            } else if (re.test(email) != true) {
                $("#InvalidEmailError").css("display", "block");
                $("#screenLockMask").hide();
                return false;
            }
        }
        $("#screenLockMask").hide;
        $(this).hide;
        return true;
    });
    $(".multiChoice").on("click", function (e) {
        var qfReplace = $(this).closest("form").data("formidentifier");
        var currentValue = $("#" + qfReplace + "AnswerFlowIdSelection").val();
        if (currentValue == null || currentValue == "" || currentValue == undefined) {
            $(".AnswerFollowListError").css("display", "block");
            $("#screenLockMask").hide();
            e.preventDefault();
            return false;
        }
    });
    $(".sideMenuOpenTrigger a").on("tap click", function (event, data) {
        var formId = $(this).closest("form").data("formidentifier");
        var sideMenuId = "SideMenu" + formId;
        event.stopPropagation();
        event.preventDefault();
        openSideMenuWithId(sideMenuId);
    });
    $(".sideMenuCloseTrigger").on("tap click", function (event, data) {
        var formId = $(this).closest("form").data("formidentifier");
        var sideMenuId = "SideMenu" + formId;
        event.stopPropagation();
        event.preventDefault();
        closeSideMenuWithId(sideMenuId);
    });
    $(".multiChoice").on("click", function (e) {
        var qfReplace = $(this).closest("form").data("qflowid");
        var currentValue = $("#" + qfReplace + "AnswerFlowIdSelection").val();
        if (currentValue == null || currentValue == "" || currentValue == undefined) {
            $(".AnswerFollowListError").css("display", "block");
            $("#screenLockMask").hide();
            e.preventDefault();
            return false;
        }
    });
    $("input[name=MultiChoiceAnswerFlows]").on("click", function () {
        var qfReplace = $(this).closest("form").data("qflowid");
        var currentValue = $("#" + qfReplace + "AnswerFlowIdSelection").val() != undefined ? $("#" + qfReplace + "AnswerFlowIdSelection").val() : "";
        if (this.checked == true) {
            $("#" + qfReplace + "AnswerFlowIdSelection").val(currentValue + "#" + this.id + "%");
        } else if (this.checked != true) {
            $("#" + qfReplace + "AnswerFlowIdSelection").val(currentValue.replace("#" + this.id + "%", ""));
        }
    });
    $(".multichoiceReview .votes .vote").on("click", function () {
        var qfReplace = $(this).closest("form").data("qflowid");
        var i = parseInt($(this).attr("id").replace(qfReplace, ""));
        $(".message").css("color", "#5a5a5a");
        $(".multichoiceReview .votes .vote").removeClass("active");
        $(this).addClass("active");
        $(".multichoiceReview .votes .vote").removeClass("ticked");
        var activeIcon;
        if (i == 1) activeIcon = "icon-sad";
        if (i == 2) activeIcon = "icon-neutral";
        if (i == 3) activeIcon = "icon-happy";
        if (i == 4) activeIcon = "icon-very-happy";
        $(".multichoiceReview .votes .vote").removeClass("icon-sad").removeClass("icon-neutral").removeClass("icon-very-happy").removeClass("icon-happy");
        var messageHtml = $(".interrate" + i + "").html();
        $(".multichoiceReview .message").html(messageHtml);
        $(".ratingValue").val(i);
        $("#" + qfReplace + "1").addClass("icon-sad");
        $("#" + qfReplace + "2").addClass("icon-neutral");
        $("#" + qfReplace + "3").addClass("icon-happy");
        $("#" + qfReplace + "4").addClass("icon-very-happy");
        for (var a = 1; a <= i; a++) {
            $("#" + qfReplace + a)
                .removeClass("icon-sad")
                .removeClass("icon-neutral")
                .removeClass("icon-very-happy")
                .removeClass("icon-happy")
                .addClass(activeIcon)
                .addClass("ticked");
        }
        if ($(".ratingValue").val() == 1 || $(".ratingValue").val() == 2) {
            var totalNegativeAnswers = $("." + qfReplace + "0").length;
            $("." + qfReplace + "0")
                .find("input[name=MultiChoiceAnswerFlows]")
                .prop("checked", false);
            $("." + qfReplace + "1")
                .find("input[name=MultiChoiceAnswerFlows]")
                .prop("checked", false);
            $("." + qfReplace + "1").css("display", "none");
            $("#" + qfReplace + "AnswerFlowIdSelection").val("");
            if (totalNegativeAnswers == 1) {
                $("#" + qfReplace + "AnswerFlowIdSelection").val(
                    "#" +
                    $("." + qfReplace + "0")
                        .find("input[name=MultiChoiceAnswerFlows]")
                        .val() +
                    "%"
                );
                $("." + qfReplace + "0").css("display", "none");
            } else {
                $("." + qfReplace + "0").css("display", "block");
            }
        } else if ($(".ratingValue").val() == 3 || $(".ratingValue").val() == 4) {
            var totalPositiveAnswers = $("." + qfReplace + "1").length;
            $("." + qfReplace + "0")
                .find("input[name=MultiChoiceAnswerFlows]")
                .prop("checked", false);
            $("." + qfReplace + "1")
                .find("input[name=MultiChoiceAnswerFlows]")
                .prop("checked", false);
            $("." + qfReplace + "0").css("display", "none");
            $("#" + qfReplace + "AnswerFlowIdSelection").val("");
            if (totalPositiveAnswers == 1) {
                $("#" + qfReplace + "AnswerFlowIdSelection").val(
                    "#" +
                    $("." + qfReplace + "1")
                        .find("input[name=MultiChoiceAnswerFlows]")
                        .val() +
                    "%"
                );
                $("." + qfReplace + "1").css("display", "none");
            } else {
                $("." + qfReplace + "1").css("display", "block");
            }
        } else {
            $("." + qfReplace + "0")
                .find("input[name=MultiChoiceAnswerFlows]")
                .prop("checked", false);
            $("." + qfReplace + "1")
                .find("input[name=MultiChoiceAnswerFlows]")
                .prop("checked", false);
            $("." + qfReplace + "0").css("display", "none");
            $("." + qfReplace + "1").css("display", "none");
            $("#" + qfReplace + "AnswerFlowIdSelection").val("");
        }
    });
    $("#RegionSelector").on("change", function () {
        var region = $(this);
        var regionAbbrev = region.val();
        $("#CountryCode").val(regionAbbrev);
        $("#screenLockMask").hide();
    });
    $("input[name=IsMarketingConsentGiven]").on("tap click", function () {
        var formId = $(this).closest("form").data("formidentifier");
        var consentType = "#ConsentType" + formId;
        if (this.checked == true) {
            $(consentType).val("7");
            $(".consentType").prop("checked", true);
        }
        if (this.checked != true) {
            $(consentType).val("0");
            $(".consentType").prop("checked", false);
        }
    });
    $(".consentType").on("click", function () {
        var formId = $(this).closest("form").data("formidentifier");
        var acceptmail = "#IsAcceptEmail" + formId;
        var acceptsms = "#IsAcceptSms" + formId;
        var acceptcalls = "#IsAcceptCalls" + formId;
        var consentType = "#ConsentType" + formId;
        if ($(acceptmail).is(":checked") == true && $(acceptcalls).is(":checked") == true && $(acceptsms).is(":checked") == true) {
            $(consentType).val("7");
            $("input[name=IsMarketingConsentGiven]").prop("checked", true);
        } else if ($(acceptmail).is(":checked") == true && $(acceptcalls).is(":checked") == true) {
            $(consentType).val("6");
            $("input[name=IsMarketingConsentGiven]").prop("checked", true);
        } else if ($(acceptcalls).is(":checked") == true && $(acceptsms).is(":checked") == true) {
            $(consentType).val("5");
            $("input[name=IsMarketingConsentGiven]").prop("checked", true);
        } else if ($(acceptmail).is(":checked") == true && $(acceptsms).is(":checked") == true) {
            $(consentType).val("4");
            $("input[name=IsMarketingConsentGiven]").prop("checked", true);
        } else if ($(acceptcalls).is(":checked") == true) {
            $(consentType).val("3");
            $("input[name=IsMarketingConsentGiven]").prop("checked", true);
        } else if ($(acceptmail).is(":checked") == true) {
            $(consentType).val("2");
            $("input[name=IsMarketingConsentGiven]").prop("checked", true);
        } else if ($(acceptsms).is(":checked") == true) {
            $(consentType).val("1");
            $("input[name=IsMarketingConsentGiven]").prop("checked", true);
        } else {
            $(consentType).val("0");
            $("input[name=IsMarketingConsentGiven]").prop("checked", false);
        }
    });
    $(".sendVerificationCode").on("click", function (e) {
        e.preventDefault();
        var currentForm = $(this).closest("form");
        var currentFormId = $(this).closest("form").data("formidentifier");
        var ipointCountryCode = currentForm.children("#CountryCode").val();
        var contact = currentForm.find("input[name=ContactInfo]").val();
        var verificationCode = currentForm.find("input[name=VerificationCode]");
        $(".sendVerificationCode").addClass("scale-out-hor-right");
        $("#VerificationDirections").css("display", "none");
        $("#screenLockMask").show();
        var contactData = { ContactInfo: contact, CountryCode: ipointCountryCode };
        $.ajax({
            type: "POST",
            url: "/Login/SendVerificationCode/",
            data: JSON.stringify(contactData),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                $("#screenLockMask").hide();
                if (response.success == true) {
                    $("#VerificationCodeError").css("display", "none");
                    $("#MandatoryMobileError").css("display", "none");
                    $("#VerificationCodeSent").css("display", "block");
                    $(".sendVerificationCode").css("display", "none");
                    verificationCode.css("display", "inline-block");
                    verificationCode.addClass("scale-in-hor-left");
                } else if (response.redirectUrl != null && response.redirectUrl != "") {
                    window.location.href = response.redirectUrl;
                } else {
                    $("#MandatoryMobileError").css("display", "block");
                }
            },
            error: function (response) {
                $("#screenLockMask").hide();
                location.reload();
            },
            timeout: 10000,
        });
    });
    $(".sendEmailVerificationCode").on("click", function (e) {
        e.preventDefault();
        var currentForm = $(this).closest("form");
        var currentFormId = $(this).closest("form").data("formidentifier");
        var email = currentForm.find("input[name=Email]").val();
        var verificationCode = currentForm.find("input[name=EmailVerificationCode]");
        $(".sendEmailVerificationCode").addClass("scale-out-hor-right");
        $("#EmailVerificationDirections").css("display", "none");
        $("#screenLockMask").show();
        var contactData = { Email: email };
        $.ajax({
            type: "POST",
            url: "/Login/SendEmailVerificationCode/",
            data: JSON.stringify(contactData),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                $("#screenLockMask").hide();
                if (response.success == true) {
                    $("#EmailVerificationCodeError").css("display", "none");
                    $("#MandatoryEmailError").css("display", "none");
                    $("#EmailVerificationCodeSent").css("display", "block");
                    $(".sendEmailVerificationCode").css("display", "none");
                    verificationCode.css("display", "inline-block");
                    verificationCode.addClass("scale-in-hor-left");
                } else if (response.redirectUrl != null && response.redirectUrl != "") {
                    window.location.href = response.redirectUrl;
                } else {
                    $("#MandatoryEmailError").css("display", "block");
                }
            },
            error: function (response) {
                $("#screenLockMask").hide();
                location.reload();
            },
            timeout: 10000,
        });
    });
    $("#ParentDynamicAnswerId").on("change", function () {
        var parentAnswer = $(this);
        var childSelect = $("#ChildAnswerId");
        var childSelectContainer = $("#ChildAnswersContainer");
        $("#DynamicAnswerError").css("display", "none");
        if (parentAnswer.val() != null && parentAnswer.val() != "0") {
            $("#screenLockMask").hide();
            childSelectContainer.css("display", "block");
            childSelect.empty();
            childSelect.append('<option value="" selected></option');
            $.getJSON("/Questions/GetChildAnswerList", { ParentAnswerId: parentAnswer.val() }, function (data) {
                $(data).each(function () {
                    $("<option value=" + this.Id + ">" + this.Explanation + "</option>").appendTo(childSelect);
                });
            });
            $("input[name=RatingAnswerId]").val("");
        } else if (parentAnswer.val() == "0") {
            $("input[name=RatingAnswerId]").val("0");
            $("#screenLockMask").hide();
            childSelect.find("option").remove();
            childSelectContainer.css("display", "none");
        } else {
            $("#screenLockMask").hide();
            childSelect.find("option").remove();
            childSelectContainer.css("display", "none");
        }
    });
    $("#ChildAnswerId").on("change", function () {
        var childAnswer = $(this);
        var ratingAnswer = childAnswer.val();
        if (ratingAnswer != null || ratingAnswer != "") {
            $("#DynamicAnswerError").css("display", "none");
            $("#ChildAnswerSelectWarning").css("display", "none");
        }
        $("input[name=RatingAnswerId]").val(ratingAnswer);
        $("#screenLockMask").hide();
    });
    $(".parentOptionList").on("change", function () {
        var childSelect = $(this).parent().find(".childOptionList");
        var parentSelect = $(this);
        if (parentSelect.val() != null && parentSelect.val() != "") {
            childSelect.empty();
            childSelect.append($("<option></option>").attr("value", "").text(parentSelect.data("placeholder")));
            $.getJSON("/M/GetOptionListForUnit/", { Id: parentSelect.val(), ReqUnit: parentSelect.data("requnittype"), ResOption: parentSelect.data("resunittype") }, function (data) {
                if (data[0].Key != "0" && data[0].Key != 0) {
                    $(data).each(function () {
                        childSelect.append($("<option></option>").attr("value", this.Key).text(this.Value));
                    });
                    childSelect.show();
                }
            });
        } else {
            childSelect.empty().attr("disabled", true);
            childSelect.hide();
        }
    });
    $(".childOptionList").on("change", function () {
        $("#Jloader").show();
        var followingAction = $(this).parent().data("updateaction");
        var followingController = $(this).parent().data("updatec");
        var newunitid = $(this).val();
        var connectedunitid = $(this).parent().data("connectedunitid");
        var strfunction = $(this).parent().data("strcomplete");
        if (followingAction != null && followingAction != "") {
            var postUrl = "/" + followingController + "/" + followingAction;
            $.ajax({
                type: "POST",
                url: postUrl,
                data: { NewUnitId: newunitid, ConnectedUnitId: connectedunitid },
                dataType: "json",
                success: function (result) {
                    if (result.Success != "0" && result.Success != 0) {
                        window[strfunction](connectedunitid);
                    }
                },
                error: function (xhr, textStatus, errorThrown) {
                    $("#Jloader").hide();
                    return false;
                },
                complete: function () {
                    $("#Jloader").hide();
                    return false;
                },
            });
        } else {
            return false;
        }
    });
    $("#Partialcomment1").on("keyup", function () {
        var str = $("#Partialcomment1").val() + "_" + $("#Partialcomment2").val() + "_" + $("#Partialcomment3").val();
        $("#Comment").val(str);
    });
    $("#Partialcomment2").on("keyup", function () {
        var str = $("#Partialcomment1").val() + "_" + $("#Partialcomment2").val() + "_" + $("#Partialcomment3").val();
        $("#Comment").val(str);
    });
    $("#Partialcomment3").on("keyup", function () {
        var str = $("#Partialcomment1").val() + "_" + $("#Partialcomment2").val() + "_" + $("#Partialcomment3").val();
        $("#Comment").val(str);
    });
   // $(".customIntroItem").on("click", function () {
    //    $("#CustomIntroIntendedFeatures").modal({ fadeDuration: 250 });
   // });
    $(".menuGroupTopNav").on("click", function () {
        $("#AvailableMenuGroups").modal({ fadeDuration: 250 });
    });
    $(".addOneToBasket").on("tap click", function (event) {
        event.preventDefault();
        var productId = $(this).parent().attr("id");
        addToBasket(productId);
    });
    $('a[href="#ProductInfo"]').on("tap click", function (event) {
        event.preventDefault();
        var productId = $(this).parent().attr("id");
        productDetailPopup(productId);
    });
    $("#ProductInfo").on("click", ".addToBasketModal", function (event) {
        event.preventDefault();
        var productId = $("#ProductInfo").attr("value");
        addToBasket(productId);
    });
    if ($("#InteractionsBtn").length > 0) {
        $("#basketLoader").css("display", "block");
  
    }
    $("#InteractionsBtn").on("click", function () {
        $("#Interactions").modal({ fadeDuration: 250 });
    });
    $("#AttendantLink").on("click", function () {
        $("#basketLoader").css("display", "block");
        $("#CallAttendant").css("display", "none");
        $.ajax({
            type: "POST",
            url: "/Menu/CallAttendant",
            data: {},
            dataType: "json",
            success: function (response) {
                $("#basketLoader").css("display", "none");
                if (response.success) {
                    $("#CallAttendant").text(response.Message);
                    $("#CallAttendant").css("display", "block");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                $("#CallAttendant").css("display", "none");
                $("#basketLoader").css("display", "none");
                return false;
            },
            complete: function () {
                $("#basketLoader").css("display", "none");
                return false;
            },
        });
    });
    $(".iPointOrderItemCount").on("change", function (event) {
        event.preventDefault();
        var productId = $(this).attr("name");
        var quantity = $(this).val();
        updateItemCount(productId, quantity);
    });
    $(".removeFromBasket").on("tap click", function (event) {
        event.preventDefault();
        var productId = $(this).parent().attr("id");
        removeFromBasket(productId);
    });
    $("#iPointOrderOrderType").on("change", function (event) {
        var selectedType = $("#iPointOrderOrderType").val();
        $.ajax({
            type: "POST",
            url: "/Menu/UpdateOrderType",
            data: { orderType: selectedType },
            dataType: "text",
            success: function (resultData) {
                if (selectedType == "0") {
                    $(".basketAddress").css("display", "inline-block");
                    $("#createOrderBtn").css("display", "block");
                    $("#sendViaWhatsapp").css("display", "none");
                } else if (selectedType == "3") {
                    $(".basketAddress").css("display", "inline-block");
                    $("#createOrderBtn").css("display", "none");
                    $("#sendViaWhatsapp").css("display", "block");
                } else if (selectedType == "1" || selectedType == "2") {
                    $(".basketAddress").css("display", "none");
                    $("#createOrderBtn").css("display", "block");
                    $("#sendViaWhatsapp").css("display", "none");
                } else if (selectedType == "4" || selectedType == "5") {
                    $(".basketAddress").css("display", "none");
                    $("#createOrderBtn").css("display", "none");
                    $("#sendViaWhatsapp").css("display", "block");
                } else {
                    $("#createOrderBtn").css("display", "none");
                    $("#sendViaWhatsapp").css("display", "none");
                }
                if (resultData != "501") {
                    $("#iPointOrderTypeExplanation").empty().text(resultData);
                }
            },
            error: function (response) {
                location.reload();
            },
        });
    });
    $("#iPointOrderPaymentMethod").on("change", function (event) {
        var selectedType = $(this).val();
        $.ajax({
            type: "POST",
            url: "/Menu/UpdatePaymentMethod",
            data: { paymentMethod: selectedType },
            dataType: "text",
            success: function (resultData) { },
            error: function (response) {
                location.reload();
            },
        });
    });
    $("#sendViaWhatsapp").on("click", function (event) {
        event.preventDefault();
        var ordertype = $("#iPointOrderOrderType").val();
        var address = $("#shippingaddress").val();
        var notes = $("#notes").val();
        var paymentmethod = $("#iPointOrderPaymentMethod").val();
        if (ordertype == "0" && (address == null || address == "")) {
            $("#addressValidation").css("display", "block");
            return false;
        } else {
            $("#addressValidation").css("display", "none");
        }
        $.ajax({
            type: "POST",
            url: "/Menu/WhatsappOrder",
            data: { orderType: ordertype, paymentMethod: paymentmethod, shippingaddress: address, notes: notes },
            dataType: "text",
            success: function (resultData) {
                if (resultData != "501") {
                    window.location = resultData;
                    return false;
                } else {
                    location.reload();
                }
            },
            error: function (response) {
                location.reload();
            },
        });
    });
});
$(document).ajaxError(function (e, xhr, opts) {
    if (xhr.status == 403 && xhr.responseText.indexOf("SessionExpiredRedirectUrl") != -1) {
        var d = $.parseJSON(xhr.responseText);
        $("#SessionExpired a").attr("href", d.SessionExpiredRedirectUrl);
        $("#SessionExpired").modal({ fadeDuration: 250, escapeClose: false, clickClose: false, showClose: false });
    }
});
function openSideMenuWithId(sideMenuId) {
    document.getElementById(sideMenuId).style.width = "100%";
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}
function closeSideMenuWithId(sideMenuId) {
    document.getElementById(sideMenuId).style.width = "0";
}
function hasNumber(myString) {
    return /\d/.test(myString);
}
function validatePassword() {
    var rules = [
        { Pattern: "[A-Z]", Target: "UpperCase" },
        { Pattern: "[a-z]", Target: "LowerCase" },
        { Pattern: "[0-9]", Target: "Numbers" },
        { Pattern: "[!@@#$%^&_?*]", Target: "Symbols" },
    ];
    var password = $(this).val();
    $("#Length").removeClass(password.length > 7 ? "redfield" : "greenfield");
    $("#Length").addClass(password.length > 7 ? "greenfield" : "redfield");
    for (var i = 0; i < rules.length; i++) {
        $("#" + rules[i].Target).removeClass(new RegExp(rules[i].Pattern).test(password) ? "redfield" : "greenfield");
        $("#" + rules[i].Target).addClass(new RegExp(rules[i].Pattern).test(password) ? "greenfield" : "redfield");
    }
}
function updateFeedbackFCategories(feedbackid) {
    var divTo = $("#FCategories_" + feedbackid);
    var categories = "";
    $.getJSON("/M/GetOptionListForUnit/", { Id: feedbackid, ReqUnit: "Feedback", ResOption: "CompanyFCategory" }, function (data) {
        divTo.empty();
        if (data[0].Key != "0" && data[0].Key != 0) {
            $(data).each(function () {
                categories += '<b style="font-weight:700; font-size:25px;color:#111111;background:lightblue;padding:10px;border-radius:6px;margin-right:10px;">' + this.Value + "</b>";
            });
            divTo.append(categories);
        }
    });
}
function addToBasket(iptMenuProductIPointId) {
    $("#basketLoader").css("display", "block");
    var productId = iptMenuProductIPointId;
    if (productId == null || productId == "") {
        productId = $("#ProductInfo").attr("value");
    }
    var productData = { IPTMenuProductIPointId: productId };
    var currency = $("#currency").attr("value");
    $.ajax({
        type: "POST",
        url: "/Menu/AddToBasket/",
        data: JSON.stringify(productData),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            $("#basketLoader").css("display", "none");
            if (response.success) {
                if (response.OrderItemListCount == "1") {
                    $("#Basket i").removeClass("icon-basket");
                    $("#Basket i").addClass("icon-basket-loaded");
                }
                $("#Basket b").empty().text(response.OrderItemListCount);
                $("#Basket span")
                    .empty()
                    .text(response.OrderTotal + " " + currency);
                $.modal.close();
            } else {
                $("#ProductInfo").append("<div>" + response.Message + "</div>");
            }
        },
        error: function (response) {
            location.reload();
        },
    });
}
function removeFromBasket(iptMenuProductIPointId) {
    $("#basketLoader").css("display", "block");
    var productId = iptMenuProductIPointId;
    var productData = { IPointOrderItemId: productId };
    $.ajax({
        type: "POST",
        url: "/Menu/RemoveFromBasket/",
        data: JSON.stringify(productData),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            $("#basketLoader").css("display", "none");
            if (response.success) {
                $("#iPointOrderTotalAmount")
                    .empty()
                    .html('<b style="font-size:30px;font-weight:600;">' + response.OrderTotal + '</b> <span style="font-family:Roboto;"> ' + response.Currency + "</span>");
                $("#" + productId).remove();
            } else {
                location.reload();
            }
        },
        error: function (response) {
            location.reload();
        },
    });
}
function updateItemCount(iptMenuProductIPointId, quantity) {
    $("#basketLoader").css("display", "block");
    var productId = iptMenuProductIPointId;
    var qty = quantity;
    var productData = { IPointOrderItemId: productId, Quantity: qty };
    $.ajax({
        type: "POST",
        url: "/Menu/UpdateIPointOrderItemQuantity/",
        data: JSON.stringify(productData),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            $("#basketLoader").css("display", "none");
            if (response.success) {
                $("#iPointOrderTotalAmount")
                    .empty()
                    .html('<b style="font-size:30px;font-weight:600;">' + response.OrderTotal + '</b> <span style="font-family:Roboto;"> ' + response.Currency + "</span>");
                $("#" + productId)
                    .find(".iPointOrderItemPrice")
                    .empty()
                    .html(response.OrderItemNewAmount + '<span style="font-family:Roboto;"> ' + response.Currency + "</span>");
            } else {
                location.reload();
            }
        },
        error: function (response) {
            location.reload();
        },
    });
}
