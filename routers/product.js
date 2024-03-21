const { default: axios } = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const router = express.Router();
router.get("/product", async (req, res) => {
  let { keyword, page } = req.query;
  const offset = (page - 1) * 50;

  try {
    const result = await axios.get(
      `https://search-api.29cm.co.kr/api/v4/products?keyword=${keyword}&brands=&categoryLargeCode=&categoryMediumCode=&categorySmallCode=&isFreeShipping=&isDiscount=&minPrice=&maxPrice=&colors=&limit=50&offset=${offset}&sort=latest&gender=&excludeSoldOut=`
    );

    return res.status(200).json(result.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "error" });
  }
});

router.get("/product-total", async (req, res) => {
  const { keyword } = req.query;

  try {
    const result = await axios.get(
      `https://search-api.29cm.co.kr/api/v4/products/meta?keyword=${keyword}&isFreeShipping=&isDiscount=&excludeSoldOut=&sort=`
    );
    const productTotal = result.data.data.totalCount.productTotalCount;
    // 한 페이지당 아이템 수
    const itemsPerPage = 50;

    // 전체 페이지 수 계산
    const totalPages = Math.ceil(productTotal / itemsPerPage);

    // 첫 페이지와 끝 페이지 계산
    const firstPage = 1;
    const lastPage = totalPages;

    return res.status(200).json({ productTotal, firstPage, lastPage });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "error" });
  }
});

router.get("/category", async (req, res) => {
  try {
    const result = await axios.get(
      "https://recommend-api.29cm.co.kr/api/v4/best/categories"
    );
    return res.status(200).json(result.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "error" });
  }
});

router.get("/product-musinsa", async (req, res) => {
  const { keyword } = req.query;

  try {
    const response = await axios.get(
      `https://www.musinsa.com/search/musinsa/integration?q=${keyword}`
    );

    const $ = cheerio.load(response.data);

    // 모든 <a> 태그 선택
    const anchorElements = $("p.list_info a:first");
    let title = "";
    let price = "";
    let href = "";

    // 각 요소에서 title과 data-bh-content-meta3 속성 값 가져오기
    anchorElements.each((index, element) => {
      if (
        $(element).attr("title").toLowerCase().includes(keyword.toLowerCase())
      ) {
        href = $(element).attr("href");
        title = $(element).attr("title");
        price = $(element).attr("data-bh-content-meta3");
      }
    });
    return res.status(200).json({ title, price, href });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "error" });
  }
});
module.exports = router;
//https://recommend-api.29cm.co.kr/api/v4/best/items?categoryList=268100100&periodSort=NOW&limit=100&offset=0
