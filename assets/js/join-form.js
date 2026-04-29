

import { supabase } from "./supabase-config.js";

(() => {
  console.log("join-form.js loaded with Supabase");

  const applyForm = document.getElementById("applyForm");
  const formSuccess = document.getElementById("formSuccess");

  if (!applyForm) {
    console.error("applyForm not found");
    return;
  }

  applyForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = applyForm.querySelector("button[type='submit']");

    const submission = {
      name: document.getElementById("joinName")?.value.trim() || "",
      email: document.getElementById("joinEmail")?.value.trim() || "",
      phone: document.getElementById("joinPhone")?.value.trim() || "",
      experience: document.getElementById("joinExperience")?.value || "",
      message: document.getElementById("joinMessage")?.value.trim() || "",
      source_site: window.location.hostname || "join.pinnaclerealty.ca",
      destination_email: "marketing@pinnaclerealty.ca",
      type: "join_meeting_request",
      status: "new"
    };

    if (!submission.name || !submission.email) {
      alert("Please enter your name and email.");
      return;
    }

    try {
      submitButton.disabled = true;
      submitButton.textContent = "Submitting...";

      const { error } = await supabase
        .from("join_submissions")
        .insert([submission]);

      if (error) throw error;

      const { error: emailError, data: emailData } = await supabase.functions.invoke("send-join-email", {
        body: submission
      });

      console.log("Join email function response:", emailData);
      console.log("Join email function error:", emailError);

      if (emailError) {
        console.error("Join email notification error:", emailError);
      }

      applyForm.reset();

      if (formSuccess) {
        formSuccess.style.display = "block";
        applyForm.style.display = "none";
      } else {
        alert("Thank you. Your inquiry has been received.");
      }

      console.log("Join submission saved to Supabase and email notification requested.");
    } catch (error) {
      console.error("Supabase join form error:", error);
      alert(`Supabase error: ${error.message || "Unknown error"}`);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = "Submit Your Application";
    }
  });
})();