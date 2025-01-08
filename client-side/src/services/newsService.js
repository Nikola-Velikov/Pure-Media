const baseUrl = "http://localhost:3000/news";

export const getNews = async (limit = 10, page = 1, fromDate = "", toDate = "") => {
    const url = new URL(baseUrl);
    url.searchParams.append("limit", limit);
    url.searchParams.append("page", page);
    if (fromDate) url.searchParams.append("fromDate", fromDate);
    if (toDate) url.searchParams.append("toDate", toDate);
  
    return await fetch(url);
  };

export const getOne = async function (id) {
    const res = await fetch(baseUrl+`/${id}`);
    return res;
  };
 
  export const getScore = async function () {
    const res = await fetch(baseUrl+`/score`);
    return res;
  };
