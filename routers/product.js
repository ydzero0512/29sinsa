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

router.get("/chat", async (req, res) => {
  const { text } = req.query;
  const url =
    "https://clovastudio.stream.ntruss.com/testapp/v1/chat-completions/HCX-003";
  const headers = {
    "X-NCP-CLOVASTUDIO-API-KEY":
      "NTA0MjU2MWZlZTcxNDJiY/zoN1ja9mqLqkb7xS0qPY5pzR7ZKcwHkCa3KSlqAJtH",
    "X-NCP-APIGW-API-KEY": "zNLX5D00S8b7sjhkbP83JBfjoUwxwb6bTsfjkB2S",
    "X-NCP-CLOVASTUDIO-REQUEST-ID": "22bcc416-bd5f-4ec5-b1ee-3da10f62d59f",
    "Content-Type": "application/json",
    Accept: "text/event-stream",
  };
  const data = {
    messages: [
      {
        role: "system",
        content:
          "네이버 스마트스토어에 상품을 등록할건데, 상위 노출가능성이 높은 상품명을 만들어줘.\n특정 인물이나 지역명, 브랜드명 혹은 고유명사, 관련없는 키워드는 모두 지워줘. 그리고, 입력한 키워드는 꼭 상품명에 포함되게 해!\n네이버쇼핑에 올라온 상품명들을 바탕으로, 키워드를 말하면 너는 상위 상품의 상품명을 바탕으로 질 좋은 상품명을 작성해줘.\n브랜드 명은 상품명에 포함되거나 추천하면 안돼!\n\n예시)\n우거지감자탕\n\n\n🐝셀링하니만의 추천 상품명\n국내산 우거지 듬뿍 담은 감자탕 밀키트 대용량 4.7kg\n\n\n⭐️추가 추천키워드 ( 8개 )\n- 뼈해장국\n- 돼지등뼈감자탕\n- 간편조리식품\n- 캠핑밀키트\n- 냉동감자탕\n- 해장국\n- 즉석국\n- 반조리식품\n\n\n🌟왜 추천하나요?\n- '국내산', '우거지', '듬뿍', '대용량' 등의 키워드를 통해 제품의 특징을 강조하고 있고, '감자탕', '밀키트'와 같은 주요 키워드가 잘 어우러져 있어 검색 시 노출될 가능성이 높아요.  \n\n- 따라서 이와 같이 구체적인 키워드를 적극 활용하면서도 간결하게 제품명을 정하는 것이 좋아요.  \n또 특정 계절이나 시기에 맞는 키워드를 활용하거나 이벤트나 프로모션과 관련된 키워드를 적절히 섞어주는 것도 효과적일 수 있어요.",
      },
      { role: "user", content: "신생아 아기욕조" },
      {
        role: "assistant",
        content:
          "🐝셀링하니만의 추천 상품명\n논슬립 접이식 신생아 아기 욕조 목욕용품\n\n\n⭐️추가 추천키워드 ( 7개 )\n- 유아욕조\n- 접이식아기욕조\n- 등받이욕조\n- 휴대용아기욕조\n- 미니욕조\n- 국민아기욕조\n- 신생아목욕\n\n\n🌟왜 추천하나요?\n-  '논슬립', '접이식', '신생아', '아기' 와 같은 중요 키워드들이 적절하게 조합되어 있어서 검색어로 유입될 가능성이 높아요. \n\n- 또 해당 제품의 기능인 '논슬립'과 '접이식'이라는 점을 제목에 명시함으로써 소비자가 원하는 정보를 빠르게 캐치할 수 있도록 도와줍니다. 이렇게 직관적이고 명확한 설명이 담긴 상품명은 소비자에게 신뢰감을 줄 수 있으며 구매 전환율을 높이는 데에도 도움이 돼요.",
      },
      {
        role: "user",
        content: text, // 사용자 입력된 텍스트를 넣어야 합니다.
      },
    ],
    topP: 0.8,
    topK: 22,
    maxTokens: 256,
    temperature: 0.68,
    repeatPenalty: 5.0,
    stopBefore: [],
    includeAiFilters: true,
    seed: 0,
  };

  try {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const response = await axios.post(url, data, {
      headers,
      responseType: "stream",
    });

    response.data.on("data", (chunk) => {
      const jsonString = chunk.toString();
      //console.log(jsonString);

      // JSON 데이터의 시작 위치 찾기
      const startIndex = jsonString.indexOf("{");
      if (startIndex !== -1) {
        const jsonDataString = jsonString.substring(startIndex);

        try {
          const jsonObject = JSON.parse(jsonDataString);
          console.log(jsonObject.message.content);
          if (jsonObject.message.content.length < 10) {
            res.write(`data: ${jsonObject.message.content}\n\n`);
          }
          // 이후에 필요한 로직을 추가하세요 (예: HTML에 추가 등)
        } catch (error) {
          //console.error("Error parsing JSON:", error);
        }
      } else {
        //console.error("JSON data not found in the chunk:", jsonString);
      }
    });

    response.data.on("end", () => {
      res.write("event: end\n\n");
      res.end();
    });
  } catch (error) {
    console.error("Error making request:", error);
    res.status(500).send("Error making request");
  }
});

module.exports = router;
//https://recommend-api.29cm.co.kr/api/v4/best/items?categoryList=268100100&periodSort=NOW&limit=100&offset=0
