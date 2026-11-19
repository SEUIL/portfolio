function openTargetProject(hash) {
  const target = document.getElementById(hash.slice(1));
  const project = target?.closest("details.case");
  if (project) {
    project.open = true;
  }
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", () => openTargetProject(link.hash));
});

window.addEventListener("hashchange", () => {
  openTargetProject(window.location.hash);
});

openTargetProject(window.location.hash);
