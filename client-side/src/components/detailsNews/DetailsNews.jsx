import { Link, useParams } from "react-router-dom";
import * as newsService from "../../services/newsService";
import { useEffect, useState } from "react";
import { formatDate, isFromYesterday } from "../../utils/formatDate";
import CardBtaLogo from "../../assets/images/BTA-Logo-site-600.png";
import PikLogo from "../../assets/images/pik.png";
import DunavmostLogo from "../../assets/images/dunavmost.png";
import BnrLogo from "../../assets/images/bnr.png";
import ChasaLogo from "../../assets/images/24chasa.png";
import MediaPoolLogo from "../../assets/images/mediapool.png";
import phrasesFile from "../../assets/fake_media_words.txt";
import { useHighlight } from "../../contexts/HighlightContext";
import DOMPurify from "dompurify"; // Import DOMPurify

export function Details() {
  const { id } = useParams();
  const [news, setNews] = useState({});
  const [phrases, setPhrases] = useState([]);
  const { highlightEnabled } = useHighlight();

  const sanitizeHTML = (html) => DOMPurify.sanitize(html); // Sanitize HTML content

  const highlightYellowMediaWords = (text = "", phrases = []) => {
    if (highlightEnabled && text && phrases.length > 0) {
      return phrases.reduce((highlightedText, phrase) => {
        const isSingleWord = !/\s/.test(phrase);
        const regex = isSingleWord
          ? new RegExp(`(?<!\\w)${phrase}(?!\\w)`, "gi")
          : new RegExp(phrase, "gi");
        return highlightedText.replace(regex, (match) =>
          `<b style="color: red;">${match}</b>`
        );
      }, text);
    }
    return text || "";
  };

  useEffect(() => {
    fetch(phrasesFile)
    .then((response) => response.text())
    .then((text) => {
      const wordsArray = text
        .split("\n") // Split the file into lines
        .map((phrase) => phrase.trim()) // Remove extra spaces and newline characters
        .filter((phrase) => phrase.length > 0); // Remove any empty strings
      setPhrases(wordsArray);
    })
    .catch((err) => console.error("Error loading yellow media phrases:", err));

    const getNews = async () => {
      try {
        const fetchData = await newsService.getOne(id);
        const data = await fetchData.json();
        if (data.success) {
          const formattedNews = {
            ...data.result,
            formatedCreatedAt: formatDate(data.result.createdAt),
          };

          if (formattedNews.media !== "BTA") {
            formattedNews.highlightedTitle = highlightYellowMediaWords(
              formattedNews.title,
              phrases
            );
            formattedNews.highlightedDescription = highlightYellowMediaWords(
              formattedNews.description,
              phrases
            );
          } else {
            formattedNews.highlightedTitle = formattedNews.title;
            formattedNews.highlightedDescription = formattedNews.description;
          }

          setNews(formattedNews);
        } else {
          console.error("Failed to fetch news:", data.error);
        }
      } catch (err) {
        console.error("Error fetching news:", err.message);
      }
    };

    getNews();
  }, [id]);

  return (
    <section className="section single-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12">
            <div className="page-wrapper">
              <div className="blog-title-area text-center">
                <span className="color-orange">
                  {news.formatedCreatedAt && isFromYesterday(news.formatedCreatedAt) && (
                    <a href="#" title="" style={{ fontSize: "20px" }}>
                      От вчера
                    </a>
                  )}
                </span>
                <h3
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(news.highlightedTitle || "Title"),
                  }}
                ></h3>
                <div className="blog-meta big-meta">
                  <small>
                    <a href="#" title="">
                      {news.formatedCreatedAt}
                    </a>
                  </small>
                  <small>
                    <a href="#" title="">
                      Публикувано от {news.media}
                    </a>
                  </small>
                </div>
              </div>
              <div className="single-post-media">
                
              {news.image_url ? (
  <img
    src={`https://www.bta.bg/upload/` + news.image_url}
    alt={`${news.media} Logo`}
    className="img-fluid"
  />
) : (
  <>
    {news.media === "BTA" && (
      <img src={CardBtaLogo} alt="BTA Logo" className="img-fluid" />
    )}
    {news.media === "Mediapool" && (
      <img src={MediaPoolLogo} alt="Mediapool Logo" className="img-fluid" />
    )}
    {news.media === "bnr" && (
      <img src={BnrLogo} alt="BNR Logo" className="img-fluid" />
    )}
    {news.media === "pik" && (
      <img src={PikLogo} alt="Pik Logo" className="img-fluid" />
    )}
    {news.media === "dunavmost" && (
      <img src={DunavmostLogo} alt="Dunavmost Logo" className="img-fluid" />
    )}
    {news.media === "24chasa" && (
      <img src={ChasaLogo} alt="24chasa Logo" className="img-fluid" />
    )}
  </>
)}

              </div>
              <div className="blog-content">
                <div
                  className="pp"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHTML(news.highlightedDescription || ""),
                  }}
                ></div>
              </div>
              {news.matches?.length > 0 && (
                <>
                  <hr className="invis1" />
                  <div
                    className="custombox clearfix"
                    style={{ marginTop: "100px" }}
                  >
                    <h4 className="small-title">
                      Съвпадащи новини с други медии
                    </h4>
                    <div className="row">
                      {news.matches.map((match, index) => (
                        <div
                          className="col-lg-6"
                          key={index}
                          style={{ marginBottom: "10px" }}
                        >
                          <div className="blog-box">
                            <div className="post-media">
                              <Link
                                to={`/news/${match._id}`}
                                title={match.title || "Related Content"}
                              >
                                 {match.image_url ? (
  <img
    src={`https://www.bta.bg/upload/` + match.image_url}
    alt="BTA Logo"
    className="img-fluid"
  />
) : (
  <>
    {match.media === "BTA" && (
      <img
        src={CardBtaLogo}
        alt="BTA Logo"
        className="img-fluid"
      />
    )}
    {match.media === "Mediapool" && (
      <img
        src={MediaPoolLogo}
        alt="Mediapool Logo"
        className="img-fluid"
      />
    )}
    {match.media === "bnr" && (
      <img
        src={BnrLogo}
        alt="BNR Logo"
        className="img-fluid"
      />
    )}
    {match.media === "pik" && (
      <img
        src={PikLogo}
        alt="Pik Logo"
        className="img-fluid"
      />
    )}
    {match.media === "dunavmost" && (
      <img
        src={DunavmostLogo}
        alt="Dunavmost Logo"
        className="img-fluid"
      />
    )}
    {match.media === "24chasa" && (
      <img
        src={ChasaLogo}
        alt="24chasa Logo"
        className="img-fluid"
      />
    )}
  </>
)}

                                <div className="hovereffect">
                                  <span className="" />
                                </div>
                              </Link>
                            </div>
                            <div className="blog-meta">
                              <h4>
                                <Link to={`/news/${match._id}`}>
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: sanitizeHTML(
                                        highlightYellowMediaWords(
                                          match.title || "",
                                          phrases
                                        )
                                      ),
                                    }}
                                  ></span>
                                </Link>
                              </h4>
                              <p>
                                {match.description ? (
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: sanitizeHTML(
                                        highlightYellowMediaWords(
                                          match.description.length > 194
                                            ? match.description.substring(
                                                0,
                                                194
                                              ) + "..."
                                            : match.description,
                                          phrases
                                        )
                                      ),
                                    }}
                                  ></span>
                                ) : (
                                  "No description available."
                                )}
                              </p>
                              <small>
                                <span>
                                  Публикувано от {match.media || "Media"}
                                </span>
                              </small>
                              <small>
                                <span>
                                  {match.createdAt
                                    ? formatDate(match.createdAt)
                                    : "Unknown Date"}
                                </span>
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
