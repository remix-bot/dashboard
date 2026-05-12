import { Component } from "solid-js";
import "../../styles/result.css";
import { Utils } from "../../lib/util/Utils";
import { useLocation } from "@solidjs/router";

const ErrorPage: Component = () => {
  const location = useLocation();

  const message = () => {
    const message = (location.query.m) ? location.query.m as string : "An unexpected error occurred. Please try again later.";
    return Utils.sanitiseUrlString(message || "");
  }

  const code = () => {
    const code = (location.query.code) ? location.query.code as string : "Error";
    return Utils.sanitiseUrlString(code);
  }

  return (
    <div class="result-page">
      {/* Decorative background orbs */}
      <div class="result-orb result-orb--1" />
      <div class="result-orb result-orb--red" />
      <div class="result-orb result-orb--3" />

      <div class="result-card result-card--error">
        {/* Animated X icon */}
        <div class="result-icon result-icon--error">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        </div>

        {/* Title */}
        <h1 class="result-title result-title--error">{code()}</h1>

        {/* Message */}
        <p class="result-message">{message()}</p>

        {/* Actions */}
        <div class="result-actions">
          <a href="/" class="result-btn result-btn--primary result-btn--primary-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Back to Home
          </a>
          <button
            class="result-btn result-btn--secondary"
            onclick={() => history.back()}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
