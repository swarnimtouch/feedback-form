$(document).ready(function () {
  // 1. Country Names Cleaning (Bracket hatana)
  var countryData = window.intlTelInputGlobals.getCountryData();
  for (var i = 0; i < countryData.length; i++) {
    var country = countryData[i];
    country.name = country.name.replace(/ \(.+\)/, "");
  }

  // 2. Phone Input Initialization
  var input = document.querySelector("#mobile_code");
  var iti = window.intlTelInput(input, {
    initialCountry: "in",
    preferredCountries: ["in", "us"],
    separateDialCode: true,
    utilsScript:
      "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.8/js/utils.js",
  });

  // --- Phone Number Limit Logic (India: 10 Digits) ---
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

  // ==========================================
  //  3. INDUSTRY STANDARD STAR RATING LOGIC
  // ==========================================
  
  const $stars = $(".star-rating .fa-star");
  const $ratingInput = $("#ratingInput");

  // Function to visually paint the stars
  // value: current rating (1-5)
  // isPreview: true if triggered by hover, false if by click
  function fillStars(value, isPreview = false) {
    $stars.each(function () {
      const starValue = $(this).data("value");

      // Reset classes
      $(this).removeClass("fa-solid fa-regular active hover-active");

      if (starValue <= value) {
        // Star Filled
        $(this).addClass("fa-solid");
        
        if (isPreview) {
          $(this).addClass("hover-active"); // Hover color styling
        } else {
          $(this).addClass("active"); // Permanent selection color
        }
      } else {
        // Star Empty
        $(this).addClass("fa-regular");
      }
    });
  }

  // Handle Click (Works for both Mobile & Desktop)
  $stars.on("click", function (e) {
    e.preventDefault();
    const rating = $(this).data("value");

    // Update hidden input
    $ratingInput.val(rating);

    // Update UI strictly
    fillStars(rating);

    // Trigger Validation immediately
    $("#feedbackForm").validate().element("#ratingInput");
  });

  // Handle Hover (ONLY for non-touch devices to prevent mobile glitching)
  const isTouchDevice = 'ontouchstart' in document.documentElement;

  if (!isTouchDevice) {
    $stars.on("mouseenter", function () {
      const rating = $(this).data("value");
      fillStars(rating, true); // Preview mode
    });

    $stars.on("mouseleave", function () {
      // Revert to the saved rating or 0 if nothing selected
      const savedRating = $ratingInput.val() || 0;
      fillStars(savedRating);
    });
  }

  // Initialize on page load (in case browser cached the value)
  fillStars($ratingInput.val() || 0);

  // ==========================================
  //  4. FORM VALIDATION CONFIGURATION
  // ==========================================

  // Dropdown change validation trigger
  $('select[name="hiredServices"]').on("change", function () {
    $(this).valid();
  });

  $("#feedbackForm").validate({
    ignore: [],
    rules: {
      fullName: "required",
      mobileNo: { required: true, minlength: 10, number: true },
      email: { required: true, email: true },
      orgName: "required",
      hiredServices: "required",
      rating: { required: true, min: 1 },
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
      if (element.attr("name") == "rating") error.insertAfter(".star-rating");
      else if (element.attr("name") == "mobileNo")
        error.insertAfter(element.closest(".iti"));
      else if (element.parent(".input-group").length)
        error.insertAfter(element.parent());
      else error.insertAfter(element);
    },
    highlight: function (element) {
      $(element).addClass("is-invalid").removeClass("is-valid");
    },
    unhighlight: function (element) {
      $(element).removeClass("is-invalid").addClass("is-valid");
    },
    submitHandler: function (form) {
      // Check if Modal Exists
      var modalElement = document.getElementById("successModal");

      if (modalElement) {
        var successModal = new bootstrap.Modal(modalElement);
        successModal.show();
      } else {
        alert("Form submitted successfully!");
      }

      // Reset Form Logic
      form.reset();
      fillStars(0); // Reset stars visual
      $ratingInput.val(""); // Clear hidden input
      $(form)
        .find(".is-valid, .is-invalid")
        .removeClass("is-valid is-invalid");
    },
  });
});