document.addEventListener("click", function (e) {
  // Check if the clicked element or its parent is an accordion header
  const header = e.target.closest(".accordion-header");
  console.log("ACCODION");
  if (header) {
    e.preventDefault(); // Prevent default button behavior
    console.log("Accordion header clicked:", header);

    const item = header.parentElement;
    const content = item.querySelector(".accordion-content");

    // Toggle active class
    item.classList.toggle("active");

    // Smooth Animation
    if (item.classList.contains("active")) {
      content.style.maxHeight = content.scrollHeight + "px";
      console.log("Opening accordion, height:", content.scrollHeight);
    } else {
      content.style.maxHeight = null;
      console.log("Closing accordion");
    }
  }
});
