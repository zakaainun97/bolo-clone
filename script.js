// Mengubah gambar utama saat thumbnail diklik
const thumbnails = document.querySelectorAll(".thumbnail");
const mainImage = document.getElementById("main-image");
const thumbnailRowContainer = document.querySelector(".thumbnail-slider"); // Container row
let currentIndex = 0; // Menyimpan indeks gambar yang aktif

// Fungsi untuk mengupdate thumbnail yang sedang aktif
function updateActiveThumbnail() {
  thumbnails.forEach((thumbnail, index) => {
    if (index === currentIndex) {
      thumbnail.classList.add("active-thumbnail"); // Tambahkan border hitam
      scrollThumbnailToCenter(thumbnail); // Pusatkan thumbnail yang aktif
    } else {
      thumbnail.classList.remove("active-thumbnail"); // Hapus border hitam
    }
  });
}

// Fungsi untuk memusatkan thumbnail aktif di tengah
function scrollThumbnailToCenter(thumbnail) {
  const thumbnailRowWidth = thumbnailRowContainer.clientWidth; // Lebar container thumbnail
  const thumbnailWidth = thumbnail.offsetWidth; // Lebar satu thumbnail
  const thumbnailPosition = thumbnail.offsetLeft + thumbnailWidth / 2; // Posisi tengah thumbnail
  const scrollPosition = thumbnailPosition - thumbnailRowWidth / 2; // Hitung posisi scroll yang diinginkan
  thumbnailRowContainer.scrollLeft = scrollPosition; // Set posisi scroll
}

thumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener("click", function () {
    const imageSrc = this.getAttribute("data-src");
    mainImage.src = imageSrc;
    currentIndex = index; // Update indeks saat gambar diklik
    updateActiveThumbnail(); // Update thumbnail yang aktif
  });
});

// Swipe slider functionality with boundary checks for thumbnail-row
const thumbnailRow = document.querySelector(".thumbnail-row");
const thumbnailSlider = document.querySelector(".thumbnail-slider");
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;
let startX;

thumbnailRow.addEventListener("mousedown", startDrag);
thumbnailRow.addEventListener("touchstart", startDrag);
thumbnailRow.addEventListener("mouseup", endDrag);
thumbnailRow.addEventListener("touchend", endDrag);
thumbnailRow.addEventListener("mouseleave", endDrag);
thumbnailRow.addEventListener("mousemove", dragMove);
thumbnailRow.addEventListener("touchmove", dragMove);

function startDrag(event) {
  isDragging = true;
  startX = event.type.includes("touch")
    ? event.touches[0].clientX
    : event.clientX;
  startPos = getTranslateX();
  animationID = requestAnimationFrame(animation);
}

function endDrag() {
  isDragging = false;
  cancelAnimationFrame(animationID);
  prevTranslate = currentTranslate;
}

function dragMove(event) {
  if (!isDragging) return;
  const currentX = event.type.includes("touch")
    ? event.touches[0].clientX
    : event.clientX;
  const deltaX = currentX - startX;
  currentTranslate = prevTranslate + deltaX;

  const maxTranslate = 0; // Batas kiri
  const minTranslate = -(
    thumbnailRow.scrollWidth - thumbnailSlider.clientWidth
  ); // Batas kanan

  if (currentTranslate > maxTranslate) {
    currentTranslate = maxTranslate;
  } else if (currentTranslate < minTranslate) {
    currentTranslate = minTranslate;
  }

  setTranslateX(currentTranslate);
}

function getTranslateX() {
  const style = window.getComputedStyle(thumbnailRow);
  const matrix = new WebKitCSSMatrix(style.transform);
  return matrix.m41; // Mengambil nilai translateX
}

function setTranslateX(value) {
  thumbnailRow.style.transform = `translateX(${value}px)`;
}

function animation() {
  if (isDragging) {
    requestAnimationFrame(animation);
  }
}

// Main thumbnail swipe functionality
let isMainDragging = false;
let startMainX;
let currentMainTranslate = 0;

mainImage.addEventListener("mousedown", startMainDrag);
mainImage.addEventListener("touchstart", startMainDrag);
mainImage.addEventListener("mouseup", endMainDrag);
mainImage.addEventListener("touchend", endMainDrag);
mainImage.addEventListener("mouseleave", endMainDrag);
mainImage.addEventListener("mousemove", mainDragMove);
mainImage.addEventListener("touchmove", mainDragMove);

function startMainDrag(event) {
  isMainDragging = true;
  startMainX = event.type.includes("touch")
    ? event.touches[0].clientX
    : event.clientX;
}

function endMainDrag() {
  isMainDragging = false;
}

function mainDragMove(event) {
  if (!isMainDragging) return;
  const currentX = event.type.includes("touch")
    ? event.touches[0].clientX
    : event.clientX;
  const deltaX = currentX - startMainX;

  // Threshold untuk menentukan kapan geser
  if (deltaX < -50) {
    showNextImage(); // Geser ke gambar berikutnya
    isMainDragging = false;
  } else if (deltaX > 50) {
    showPreviousImage(); // Geser ke gambar sebelumnya
    isMainDragging = false;
  }
}

function showNextImage() {
  if (currentIndex < thumbnails.length - 1) {
    currentIndex++; // Update indeks ke gambar berikutnya
  } else {
    currentIndex = 0; // Kembali ke awal jika sudah di akhir
  }
  mainImage.src = thumbnails[currentIndex].getAttribute("data-src");
  updateActiveThumbnail(); // Update thumbnail yang aktif
}

function showPreviousImage() {
  if (currentIndex > 0) {
    currentIndex--; // Geser ke gambar sebelumnya
  } else {
    currentIndex = thumbnails.length - 1; // Kembali ke gambar terakhir jika di awal
  }
  mainImage.src = thumbnails[currentIndex].getAttribute("data-src");
  updateActiveThumbnail(); // Update thumbnail yang aktif
}

// Pertama kali load, set active-thumbnail pada gambar pertama
updateActiveThumbnail();

// Fungsi untuk varian, mirip dengan thumbnail-row
const variants = document.querySelectorAll(".variant");
let currentVariantIndex = 0;

// Fungsi untuk mengupdate varian yang sedang aktif
function updateActiveVariant() {
  variants.forEach((variant, index) => {
    if (index === currentVariantIndex) {
      variant.classList.add("active-thumbnail"); // Tambahkan border hitam
      scrollVariantToCenter(variant); // Pusatkan varian yang aktif
    } else {
      variant.classList.remove("active-thumbnail"); // Hapus border hitam
    }
  });
}

// Fungsi untuk memusatkan varian yang aktif di tengah
function scrollVariantToCenter(variant) {
  const variantRowWidth = document.querySelector(".variant-slider").clientWidth;
  const variantWidth = variant.offsetWidth;
  const variantPosition = variant.offsetLeft + variantWidth / 2;
  const scrollPosition = variantPosition - variantRowWidth / 2;
  document.querySelector(".variant-slider").scrollLeft = scrollPosition;
}

variants.forEach((variant, index) => {
  variant.addEventListener("click", function () {
    const imageSrc = this.getAttribute("data-src");
    mainImage.src = imageSrc; // Ganti gambar utama dengan gambar varian yang diklik
    currentVariantIndex = index;
    updateActiveVariant(); // Update varian yang aktif
  });
});

// Fungsi geser slider varian
const variantRow = document.querySelector(".variant-row");
let isDraggingVariant = false;
let startVariantX,
  currentVariantTranslate = 0;

variantRow.addEventListener("mousedown", startVariantDrag);
variantRow.addEventListener("touchstart", startVariantDrag);
variantRow.addEventListener("mouseup", endVariantDrag);
variantRow.addEventListener("touchend", endVariantDrag);
variantRow.addEventListener("mouseleave", endVariantDrag);
variantRow.addEventListener("mousemove", variantDragMove);
variantRow.addEventListener("touchmove", variantDragMove);

function startVariantDrag(event) {
  isDraggingVariant = true;
  startVariantX = event.type.includes("touch")
    ? event.touches[0].clientX
    : event.clientX;
}

function endVariantDrag() {
  isDraggingVariant = false;
}

function variantDragMove(event) {
  if (!isDraggingVariant) return;
  const currentX = event.type.includes("touch")
    ? event.touches[0].clientX
    : event.clientX;
  const deltaX = currentX - startVariantX;

  // Threshold untuk menentukan kapan geser
  if (deltaX < -50) {
    showNextVariant();
    isDraggingVariant = false;
  } else if (deltaX > 50) {
    showPreviousVariant();
    isDraggingVariant = false;
  }
}

function showNextVariant() {
  if (currentVariantIndex < variants.length - 1) {
    currentVariantIndex++;
  } else {
    currentVariantIndex = 0;
  }
  mainImage.src = variants[currentVariantIndex].getAttribute("data-src");
  updateActiveVariant();
}

function showPreviousVariant() {
  if (currentVariantIndex > 0) {
    currentVariantIndex--;
  } else {
    currentVariantIndex = variants.length - 1;
  }
  mainImage.src = variants[currentVariantIndex].getAttribute("data-src");
  updateActiveVariant();
}

// Pertama kali load, set active-thumbnail pada varian pertama
updateActiveVariant();

// Fullscreen Gallery Elements
const fullscreenGallery = document.getElementById("fullscreen-gallery");
const fullscreenImage = document.getElementById("fullscreen-image");
const closeGalleryBtn = document.getElementById("close-gallery");
const prevImgBtn = document.getElementById("prev-img");
const nextImgBtn = document.getElementById("next-img");

// Fungsi untuk membuka galeri full-screen
function openFullscreenGallery(imageSrc) {
  fullscreenImage.src = imageSrc;
  fullscreenGallery.style.display = "flex"; // Tampilkan galeri full-screen
}

// Fungsi untuk menutup galeri full-screen
closeGalleryBtn.addEventListener("click", function () {
  fullscreenGallery.style.display = "none";
});

// Saat main thumbnail di klik, buka galeri full-screen
mainImage.addEventListener("click", function () {
  openFullscreenGallery(mainImage.src); // Tampilkan gambar di galeri
});

// Fungsi untuk navigasi gambar dalam galeri
function showNextImageInGallery() {
  if (currentIndex < thumbnails.length - 1) {
    currentIndex++;
  } else {
    currentIndex = 0; // Kembali ke awal
  }
  fullscreenImage.src = thumbnails[currentIndex].getAttribute("data-src");
}

function showPreviousImageInGallery() {
  if (currentIndex > 0) {
    currentIndex--;
  } else {
    currentIndex = thumbnails.length - 1; // Kembali ke gambar terakhir
  }
  fullscreenImage.src = thumbnails[currentIndex].getAttribute("data-src");
}

// Navigasi galeri dengan tombol Next dan Prev
nextImgBtn.addEventListener("click", showNextImageInGallery);
prevImgBtn.addEventListener("click", showPreviousImageInGallery);

// Geser gambar dengan swipe di fullscreen mode
let isGalleryDragging = false;
let startGalleryX;

fullscreenImage.addEventListener("mousedown", startGalleryDrag);
fullscreenImage.addEventListener("touchstart", startGalleryDrag);
fullscreenImage.addEventListener("mouseup", endGalleryDrag);
fullscreenImage.addEventListener("touchend", endGalleryDrag);
fullscreenImage.addEventListener("mousemove", galleryDragMove);
fullscreenImage.addEventListener("touchmove", galleryDragMove);

function startGalleryDrag(event) {
  isGalleryDragging = true;
  startGalleryX = event.type.includes("touch")
    ? event.touches[0].clientX
    : event.clientX;
}

function endGalleryDrag() {
  isGalleryDragging = false;
}

function galleryDragMove(event) {
  if (!isGalleryDragging) return;
  const currentX = event.type.includes("touch")
    ? event.touches[0].clientX
    : event.clientX;
  const deltaX = currentX - startGalleryX;

  if (deltaX < -50) {
    showNextImageInGallery(); // Geser ke gambar berikutnya
    isGalleryDragging = false;
  } else if (deltaX > 50) {
    showPreviousImageInGallery(); // Geser ke gambar sebelumnya
    isGalleryDragging = false;
  }
}

// Fungsi Zoom
let scale = 1;
let isZoomed = false;
let initialX, initialY;

// Fungsi untuk memperbesar gambar
function zoomIn() {
  fullscreenImage.classList.add("zoomed");
  scale = 2; // Ukuran zoom bisa disesuaikan
  fullscreenImage.style.transform = `scale(${scale})`;
  isZoomed = true;
}

// Fungsi untuk memperkecil gambar
function zoomOut() {
  fullscreenImage.classList.remove("zoomed");
  scale = 1;
  fullscreenImage.style.transform = `scale(${scale})`;
  fullscreenImage.style.transformOrigin = "center";
  isZoomed = false;
}

// Fungsi toggle zoom on click
fullscreenImage.addEventListener("click", function (event) {
  if (!isZoomed) {
    zoomIn();
    // Set titik asal transformasi di lokasi klik
    const rect = fullscreenImage.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    fullscreenImage.style.transformOrigin = `${offsetX}px ${offsetY}px`;
  } else {
    zoomOut();
  }
});

// Fungsi untuk zoom menggunakan scroll wheel
fullscreenImage.addEventListener("wheel", function (event) {
  if (event.deltaY < 0 && !isZoomed) {
    zoomIn();
  } else if (event.deltaY > 0 && isZoomed) {
    zoomOut();
  }
});

// Fungsi untuk zoom menggunakan pinch (mobile gesture)
fullscreenImage.addEventListener("touchstart", function (event) {
  if (event.touches.length === 2) {
    initialX = event.touches[0].clientX - event.touches[1].clientX;
    initialY = event.touches[0].clientY - event.touches[1].clientY;
  }
});

fullscreenImage.addEventListener("touchmove", function (event) {
  if (event.touches.length === 2) {
    const currentX = event.touches[0].clientX - event.touches[1].clientX;
    const currentY = event.touches[0].clientY - event.touches[1].clientY;
    const distance = Math.sqrt(currentX * currentX + currentY * currentY);
    const initialDistance = Math.sqrt(
      initialX * initialX + initialY * initialY
    );

    if (distance > initialDistance && !isZoomed) {
      zoomIn();
    } else if (distance < initialDistance && isZoomed) {
      zoomOut();
    }
  }
});

// Function to smoothly slide the main thumbnail to the next image
function updateMainImage(index) {
  mainImage.src = thumbnails[index].getAttribute("data-src");
  thumbnails.forEach((img) => (img.style.border = "none"));
  thumbnails[index].style.border = "2px solid black"; // Tambahkan border aktif
}

// Move slider smoothly to the selected thumbnail
function slideThumbnailRowToCenter(index) {
  const thumbnailWidth = thumbnails[0].clientWidth; // Lebar satu thumbnail
  const thumbnailRowWidth = thumbnailRow.clientWidth;
  const totalThumbnails = thumbnails.length;

  const offset =
    index * thumbnailWidth - thumbnailRowWidth / 2 + thumbnailWidth / 2;

  // Batasi agar tidak melebihi ukuran maksimal dan minimal row
  const maxScroll = thumbnailWidth * totalThumbnails - thumbnailRowWidth;
  const translateX = Math.max(0, Math.min(maxScroll, offset));

  thumbnailRow.style.transform = `translateX(-${translateX}px)`;
}

// Update the main image slider smoothly
function slideMainThumbnail(index) {
  const totalImages = thumbnails.length;
  const mainWidth = mainImage.clientWidth;

  // Geser gambar berdasarkan index
  mainImage.style.transform = `translateX(-${index * mainWidth}px)`;
}

// Ketika thumbnail diklik, update main image dan slide row
thumbnails.forEach((thumbnail, index) => {
  thumbnail.addEventListener("click", () => {
    updateMainImage(index);
    slideThumbnailRowToCenter(index); // Pusatkan thumbnail aktif
  });
});

// Ketika geser main thumbnail, ganti gambar
function slideMainThumbnailNext() {
  currentIndex = (currentIndex + 1) % thumbnails.length;
  updateMainImage(currentIndex);
  slideMainThumbnail(currentIndex); // Geser thumbnail secara smooth
}

// Implementasikan logika swipe gesture pada main thumbnail jika diinginkan
// (sama dengan yang ada di galeri fullscreen sebelumnya)
