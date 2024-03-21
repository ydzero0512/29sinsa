// 페이지 바 삽입
function createPagination(firstPage, lastPage, currentPage) {
  const paginationElement = document.getElementById("pagination");

  let paginationHTML =
    '<nav aria-label="Page navigation"><ul class="pagination">';

  const pageSize = 10; // 한 그룹당 페이지 수
  const totalPages = lastPage - firstPage + 1;
  const totalPagesGroup = Math.ceil(totalPages / pageSize); // 전체 그룹 수
  const currentGroup = Math.ceil(currentPage / pageSize); // 현재 페이지가 속한 그룹

  const startPage = (currentGroup - 1) * pageSize + 1;
  const endPage = Math.min(startPage + pageSize - 1, lastPage);

  // 이전 그룹 버튼 생성
  if (currentGroup > 1) {
    paginationHTML += `
        <li class="page-item">
          <a class="page-link" onclick="fetchProductImages(${
            startPage - 1
          })">이전</a>
        </li>
      `;
  }

  // 페이지 번호 표시
  for (let page = startPage; page <= endPage; page++) {
    paginationHTML += `
        <li class="page-item ${page === currentPage ? "active" : ""}">
          <a class="page-link" href="#" onclick="fetchProductImages(${page})">${page}</a>
        </li>
      `;
  }

  // 다음 그룹 버튼 생성
  if (currentGroup < totalPagesGroup) {
    paginationHTML += `
        <li class="page-item">
          <a class="page-link" onclick="fetchProductImages(${
            endPage + 1
          })">다음</a>
        </li>
      `;
  }

  paginationHTML += "</ul></nav>";

  paginationElement.innerHTML = paginationHTML;
}

// 페이지 가져오기
async function fetchPages(keyword, currentPage) {
  try {
    const response = await axios.get("/29mu/product-total?keyword=" + keyword);
    const data = response.data;
    createPagination(data.firstPage, data.lastPage, currentPage);
  } catch (error) {
    console.error("Error fetching pages:", error);
  }
}

// // 카테고리 가져오기
// async function fetchCategory() {
//   try {
//     const response = await axios.get("/29mu/category");

//     const data = response.data.data;
//     console.log(data);
//     const categoryNav = document.getElementById("categoryNav");
//     data.slice(0, 8).forEach((category) => {
//       const navItem = document.createElement("li");
//       navItem.classList.add("nav-item");
//       const navLink = document.createElement("a");
//       navLink.classList.add("nav-link");
//       navLink.href = `#${category.categoryName
//         .replace(/\s+/g, "-")
//         .toLowerCase()}`; // 카테고리 이름을 소문자와 하이픈으로 변환하여 링크 설정
//       navLink.textContent = category.categoryName; // 카테고리 이름을 링크 텍스트로 설정
//       navItem.appendChild(navLink);
//       categoryNav.appendChild(navItem);
//     });
//   } catch (error) {
//     console.error("Error fetching pages:", error);
//   }
// }

// 키워드 입력시 29cm에서 상품 가져오기
function fetchProductImages(page) {
  const keyword = document.getElementById("keywordInput").value;
  page = page || 1;

  axios
    .get(`/29mu/product?keyword=${keyword}&page=${page}`)
    .then((response) => {
      const products = response.data.data;
      const imageContainer = document.getElementById("imageContainer");
      imageContainer.innerHTML = "";

      products.forEach((product) => {
        const imageUrl = `https://img.29cm.co.kr/${product.imageUrl}`;
        const title = product.itemName;
        const price = product.lastSalePrice.toLocaleString();
        const brand = product.frontBrandNameKor;
        const itemNo = product.itemNo;

        const colElement = document.createElement("div");
        colElement.classList.add("col");

        const imgElement = document.createElement("img");
        imgElement.src = imageUrl;
        imgElement.alt = "Product Image";
        imgElement.classList.add("img-fluid");
        imgElement.onclick = function () {
          window.open(`https://product.29cm.co.kr/catalog/${itemNo}`, "_blank");
        };
        const titleElement = document.createElement("p");
        titleElement.textContent = title;
        titleElement.classList.add("text-left");

        const priceElement = document.createElement("p");
        priceElement.textContent = price + "원";
        priceElement.classList.add("text-left");
        priceElement.id = "price";

        const brandElement = document.createElement("p");
        brandElement.textContent = brand;
        brandElement.classList.add("text-left");
        brandElement.id = "brand";

        const buttonElement = document.createElement("button");
        buttonElement.textContent = "무신사 가격 보기"; // 버튼에 표시할 텍스트 설정
        buttonElement.classList.add("btn", "btn-secondary", "text-center"); // 원하는 클래스 추가

        colElement.appendChild(imgElement);
        colElement.appendChild(brandElement);
        colElement.appendChild(titleElement);
        colElement.appendChild(priceElement);

        colElement.appendChild(buttonElement);

        buttonElement.addEventListener("click", function () {
          const title = titleElement.textContent;

          axios
            .get(`/29mu/product-musinsa?keyword=${title}`)
            .then((response) => {
              buttonElement.remove();
              const product = response.data;
              const link = product.href;
              const title2 = product.title != "" ? product.title : "상품없음";
              const price2 =
                product.price != ""
                  ? parseInt(product.price).toLocaleString()
                  : "x";
              product.price;
              const title2Element = document.createElement("p");
              title2Element.textContent = `무신사 상품명: ${title2}`;
              title2Element.classList.add("text-left");

              const price2Element = document.createElement("p");
              price2Element.textContent = `무신사 가격: ${price2}원`;
              price2Element.classList.add("text-left");
              price2Element.id = "price";

              const linkElement = document.createElement("a");
              linkElement.textContent = `무신사 상품으로 이동`;
              console.log(link);
              linkElement.href = link;
              linkElement.target = "_blank"; // 새 창으로 열기
              linkElement.classList.add("text-left");

              colElement.appendChild(title2Element);
              colElement.appendChild(price2Element);

              colElement.appendChild(linkElement);
            })
            .catch((error) => {
              console.error("Error fetching data:", error);
            });
        });

        imageContainer.appendChild(colElement);
      });
      fetchPages(keyword, page);
    })
    .catch((error) => {
      console.error("Error fetching product images:", error);
    });
}
// window.onload = function () {
//   fetchCategory();
// };
