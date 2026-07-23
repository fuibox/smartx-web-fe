(() => {
  try {
    const saved = localStorage.getItem("smartx-blog-theme");
    const theme =
      saved === "light" || saved === "dark"
        ? saved
        : "dark";

    document.documentElement.dataset.blogTheme = theme;
  } catch {
    document.documentElement.dataset.blogTheme = "dark";
  }
})();
