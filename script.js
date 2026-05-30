/* Distinctive Time Capital — interactions
   Mobile nav, prefill, form validation + mailto fallback, success state. */
(function () {
  "use strict";

  /* ---- Footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById("nav-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      mobileNav.hidden = open;
    });
    // Close after navigating
    mobileNav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.hidden = true;
      });
    });
  }

  /* ---- Prefill "interest" from path CTAs ---- */
  var form = document.getElementById("intake-form");
  document.querySelectorAll("[data-prefill]").forEach(function (el) {
    el.addEventListener("click", function () {
      var which = el.getAttribute("data-prefill");
      var map = { sell: "Sell my watch", buyback: "Buyback option" };
      var value = map[which];
      if (!value) return;
      // Defer until after the smooth scroll begins
      window.setTimeout(function () {
        var radio = form && form.querySelector('input[name="interest"][value="' + value + '"]');
        if (radio) {
          radio.checked = true;
          radio.focus({ preventScroll: true });
        }
      }, 350);
    });
  });

  /* ---- Legal links not yet built ---- */
  document.querySelectorAll("[data-todo]").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      window.alert(
        "This page (" + a.getAttribute("data-todo") + ") is not published yet.\n" +
        "Final legal copy needs owner / legal review before launch."
      );
    });
  });

  /* ---- Form validation + safe mailto fallback ---- */
  if (form) {
    var submitBtn = document.getElementById("intake-submit");
    var successBox = document.getElementById("form-success");
    var devnote = document.getElementById("form-devnote");

    var errorsBox = document.getElementById("form-errors");

    var labelFor = function (el) {
      if (el.name === "interest") return "What are you interested in?";
      var lbl = form.querySelector('label[for="' + el.id + '"]');
      return lbl ? lbl.textContent.replace("*", "").trim() : (el.name || "Field");
    };

    var setFieldError = function (el, message) {
      var field = el.closest(".field, .choice");
      if (!field) return;
      var err = field.querySelector(".field__error");
      if (message) {
        if (!err) {
          err = document.createElement("p");
          err.className = "field__error";
          err.id = (el.id || el.name) + "-error";
          field.appendChild(err);
        }
        err.textContent = message;
        el.setAttribute("aria-invalid", "true");
        el.setAttribute("aria-describedby",
          ((el.getAttribute("aria-describedby") || "").replace(err.id, "").trim() + " " + err.id).trim());
      } else if (err) {
        err.remove();
        el.removeAttribute("aria-invalid");
      }
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var firstInvalid = null;
      var problems = [];

      form.querySelectorAll("[required]").forEach(function (el) {
        if (el.type === "radio") return; // handled as a group below
        if (el.checkValidity()) {
          setFieldError(el, "");
        } else {
          var msg = el.value.trim() ? "Please check this field." : "This field is required.";
          setFieldError(el, msg);
          problems.push(labelFor(el));
          if (!firstInvalid) firstInvalid = el;
        }
      });

      // Radio group "interest" is required
      var interest = form.querySelector('input[name="interest"]:checked');
      var interestFirst = form.querySelector('input[name="interest"]');
      if (!interest) {
        setFieldError(interestFirst, "Please choose an option.");
        problems.push("What are you interested in?");
        if (!firstInvalid) firstInvalid = interestFirst;
      } else {
        setFieldError(interestFirst, "");
      }

      if (firstInvalid) {
        if (errorsBox) {
          errorsBox.textContent = "Please complete the required field" +
            (problems.length > 1 ? "s" : "") + ": " + problems.join(", ") + ".";
          errorsBox.hidden = false;
        }
        firstInvalid.focus({ preventScroll: false });
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (errorsBox) { errorsBox.hidden = true; errorsBox.textContent = ""; }

      // Build a structured submission (safe mailto fallback — no backend yet)
      var data = new FormData(form);
      var lines = [];
      var labels = {
        name: "Full name", email: "Email", phone: "Phone", location: "City / Province",
        brand: "Watch brand", model: "Model", reference: "Reference number", year: "Year",
        condition: "Condition", box_papers: "Box & papers", service_history: "Service history",
        interest: "Interested in", contact_method: "Preferred contact", message: "Message"
      };
      Object.keys(labels).forEach(function (key) {
        var v = data.get(key);
        if (v && String(v).trim()) lines.push(labels[key] + ": " + v);
      });
      var subject = "Private Watch Review — " + (data.get("brand") || "Submission");
      var body =
        "New private review request via distinctivetime.capital\n\n" +
        lines.join("\n") +
        "\n\nPhotos can be sent by email or text as a follow-up if requested.";

      // Show success state in-page
      form.querySelectorAll(".intake__grid, .form__errors, .form__consent, #intake-submit, #form-devnote")
        .forEach(function (el) { if (el) el.style.display = "none"; });
      if (successBox) {
        successBox.hidden = false;
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
        // Move focus into the success region (the submit button is now hidden)
        successBox.focus({ preventScroll: true });
      }

      // Open the user's email client via a user-context anchor click (does not
      // navigate/blank the page the way location.href can). Safe pre-launch fallback.
      var mailto = "mailto:sales@distinctivetime.capital" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
      window.setTimeout(function () {
        var a = document.createElement("a");
        a.href = mailto;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, 400);
    });

    // Clear field error as the user fixes it
    form.addEventListener("input", function (e) {
      if (e.target && e.target.getAttribute("aria-invalid") === "true" && e.target.checkValidity()) {
        setFieldError(e.target, "");
      }
    });
    form.addEventListener("change", function (e) {
      if (e.target && e.target.name === "interest") {
        setFieldError(form.querySelector('input[name="interest"]'), "");
      }
    });
  }
})();
