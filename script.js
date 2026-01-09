$(document).ready(function () {
  var countryData = window.intlTelInputGlobals.getCountryData();
  for (var i = 0; i < countryData.length; i++) {
    var country = countryData[i];
    country.name = country.name.replace(/ \(.+\)/, "");
  }

  var input = document.querySelector("#mobile_code");
  var iti = window.intlTelInput(input, {
    initialCountry: "in",
    preferredCountries: ["in", "us"],
    separateDialCode: true,
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });

  function enforceIndiaLimit() {
    var countryData = iti.getSelectedCountryData();
    if (countryData.iso2 === "in") {
      input.setAttribute("maxlength", "10");
      if (input.value.length > 10) {
        input.value = input.value.substring(0, 10);
      }
    } else {
      input.removeAttribute("maxlength");
    }
  }

  input.addEventListener("countrychange", enforceIndiaLimit);
  input.addEventListener("input", enforceIndiaLimit);
  enforceIndiaLimit();

  $(".star-rating .fa-star").on("click", function () {
    var rating = $(this).data("value");
    $("#ratingInput").val(rating);
    $(".star-rating .fa-star")
      .removeClass("selected fa-solid")
      .addClass("fa-regular");
    $(this).addClass("selected fa-solid").removeClass("fa-regular");
    $(this).prevAll().addClass("selected fa-solid").removeClass("fa-regular");
    $("#feedbackForm").validate().element("#ratingInput");
  });

  $(".star-rating .fa-star").hover(
    function () {
      $(".star-rating .fa-star").removeClass("fa-solid").addClass("fa-regular");
      $(this).addClass("fa-solid").removeClass("fa-regular");
      $(this).prevAll().addClass("fa-solid").removeClass("fa-regular");
    },
    function () {
      $(".star-rating .fa-star").removeClass("fa-solid").addClass("fa-regular");
      $(".star-rating .fa-star.selected")
        .addClass("fa-solid")
        .removeClass("fa-regular");
      $(".star-rating .fa-star.selected")
        .prevAll()
        .addClass("fa-solid")
        .removeClass("fa-regular");
    }
  );

  $("#feedbackForm").validate({
    ignore: [],
    rules: {
      fullName: "required",
      mobileNo: {
        required: true,
        minlength: 10,
        number: true,
      },
      email: {
        required: true,
        email: true,
      },
      orgName: "required",
      hiredServices: "required",
      rating: {
        required: true,
        min: 1,
      },
    },
    messages: {
      fullName: "Please enter your Name",
      mobileNo: {
        required: "Please enter your Mobile Number",
        minlength: "Please enter a valid 10-digit mobile number",
        number: "Please enter numbers only",
      },
      email: "Please enter a valid Email ID",
      orgName: "Please enter the Organization Name",
      hiredServices: "Please select a Service from the list",
      rating: "Please provide your Overall Experience rating",
    },
    errorElement: "label",
    errorPlacement: function (error, element) {
      if (element.attr("name") == "rating") {
        error.insertAfter(".star-rating");
      } else if (element.attr("name") == "mobileNo") {
        error.insertAfter(element.closest(".iti"));
      } else if (element.parent(".input-group").length) {
        error.insertAfter(element.parent());
      } else {
        error.insertAfter(element);
      }
    },
    highlight: function (element, errorClass, validClass) {
      $(element).addClass("is-invalid").removeClass("is-valid");
    },
    unhighlight: function (element, errorClass, validClass) {
      $(element).removeClass("is-invalid").addClass("is-valid");
    },
    submitHandler: function (form) {
      var successModal = new bootstrap.Modal(document.getElementById("successModal"));
      successModal.show();
      form.reset();
      $(".star-rating .fa-star")
        .removeClass("selected fa-solid")
        .addClass("fa-regular");
      $("#ratingInput").val("");
      $(form)
        .find(".is-valid, .is-invalid")
        .removeClass("is-valid is-invalid");
    },
  });
});
