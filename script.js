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

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxCount = lightbox.querySelector(".lightbox-count");
const originalLink = lightbox.querySelector(".lightbox-original");
let activePhotos = [];
let activePhotoIndex = 0;
let photoTrigger = null;

function showPhoto(index) {
  activePhotoIndex = (index + activePhotos.length) % activePhotos.length;
  const link = activePhotos[activePhotoIndex];
  lightboxImage.src = link.href;
  lightboxImage.alt = link.querySelector("img").alt;
  const caption = link.closest("figure").querySelector("figcaption");
  const title = caption.querySelector("strong").textContent;
  lightboxCaption.textContent = `${title} · ${caption.textContent.slice(title.length).trim()}`;
  lightboxCount.textContent = `${activePhotoIndex + 1} / ${activePhotos.length}`;
  originalLink.href = link.href;
}

document.querySelectorAll(".screen-gallery a").forEach((link) => {
  link.setAttribute("aria-haspopup", "dialog");
  link.addEventListener("click", (event) => {
    // Keep modified clicks available for opening the original image directly.
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    photoTrigger = link;
    activePhotos = Array.from(link.closest(".screen-gallery").querySelectorAll("a"));
    lightboxTitle.textContent = `${link.closest(".case").querySelector("h3").textContent} · 실제 화면`;
    showPhoto(activePhotos.indexOf(link));
    lightbox.showModal();
    document.body.classList.add("lightbox-open");
  });
});

lightbox.querySelector(".lightbox-close").addEventListener("click", () => lightbox.close());
lightbox.querySelector(".lightbox-prev").addEventListener("click", () => showPhoto(activePhotoIndex - 1));
lightbox.querySelector(".lightbox-next").addEventListener("click", () => showPhoto(activePhotoIndex + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});
lightbox.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    const controls = Array.from(lightbox.querySelectorAll("button, a[href]"));
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
    return;
  }
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    event.preventDefault();
    showPhoto(activePhotoIndex + (event.key === "ArrowRight" ? 1 : -1));
  }
});
lightbox.addEventListener("close", () => {
  document.body.classList.remove("lightbox-open");
  photoTrigger?.focus({ preventScroll: true });
});
