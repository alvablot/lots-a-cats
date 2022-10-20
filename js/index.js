const apiKey = "b15c050e-7d9d-4993-a300-fa79c5e86c99";
const adress = "https://api.thecatapi.com/v1/images/search";
const url = new URL(adress);
const loadImgSrc = "img/loading.gif";
const $prev = document.getElementById("prev");
const $next = document.getElementById("next");
const $pageNo = document.getElementById("page-no");
const $show = document.getElementById("show");
const $preview = document.getElementById("preview");
const $header = document.querySelector("h1");
let limit = 12;
let page = 0;
const order = "asc";



async function getImg() {

  const url = new URL(adress);
  url.searchParams.append("limit", limit);
  url.searchParams.append("page", page);
  url.searchParams.append("order", order);
  $pageNo.textContent = `Showing page ${page}`;
  const $loadImg = document.createElement("img");
  $loadImg.src = loadImgSrc;
  $show.textContent = "";
  $show.append($loadImg);
  $loadImg.classList.add("load-img");
  toggleButtons(true);

  function toggleButtons(disabled) {    
    $prev.disabled = disabled;
    $next.disabled = disabled;
    console.log(page)

  }
  
  try {
    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
    });
    const data = await response.json();
    showImg(data);
  } catch (error) {
    $show.textContent = error;
  } finally {
    toggleButtons(false);
    if (page === 0) $prev.disabled = true;

  }
}

function showImg(data) {
  $show.textContent = null;
  data.forEach(({ url }) => {
    const $img = document.createElement("img");
    $img.src = url;
    $show.append($img);

    $img.onmouseover = function (e) {
      $preview.style.display = "block";
      $preview.src = url;
      e.cancelBubble = true;
    };

    $img.onmousemove = function (e) {
      $preview.style.display = "block";
    };

    $img.onmouseout = function (e) {
      $preview.style.display = "none";
      e.cancelBubble = true;
    };
  });
  
}

getImg();

$prev.addEventListener("click", () => {
  if (page == 0) {
    return false;
  } else {
    page--;
    getImg(page);
  }
});

$next.addEventListener("click", () => {
  page++;
  getImg(page);
  if(page == 0) $prev.disabled;
});

$header.addEventListener("click", () => {
  page = 0;
  getImg();
  if(page == 0) $prev.disabled;
});

document.body.onmousemove = function (e) {
  $preview.style.left = `${e.clientX + 10}px`;
  $preview.style.top = `${e.clientY - 200}px`;
};
