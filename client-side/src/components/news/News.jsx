import { useEffect, useState } from "react";
import CardBtaLogo from '../../assets/images/BTA-Logo-site-600.png';
import {Newspaper } from "react-bootstrap-icons";
import * as newsService from "../../services/newsService";
import { formatDate, isFromYesterday } from "../../utils/formatDate";
import { Link } from "react-router-dom";
import { useHighlight } from "../../contexts/HighlightContext";
export function News() {
    const [news, setNews] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [fromDate, setFromDate] = useState(""); // New state for from date
    const [toDate, setToDate] = useState(""); // New state for to date
    const [score, setScore] = useState(""); 
    const [dateError, setDateError] = useState(""); // State for error message
    const { highlightEnabled, toggleHighlight } = useHighlight();

    const validateDates = () => {
        if (fromDate && toDate) {
            const from = new Date(fromDate);
            const to = new Date(toDate);
            if (to <= from) {
                setDateError("Крайна дата не може да бъде по-малка или равна на начална дата.");
                return false;
            }
        }
        // Clear the error if both are empty or valid
        setDateError("");
        return true;
    };
    const getScore = async () => {
        try {
          const fetchData = await newsService.getScore(); 
          console.log(1);
          
          const data = await fetchData.json();
          setScore(data.result)
        } catch (err) {
          console.error(err.message);
        }
      };
    const getAll = async (page = 1) => {
      try {
        if(validateDates()){

        
        const fetchData = await newsService.getNews(10, page, fromDate, toDate); // Pass the new date filters
        const data = await fetchData.json();
  
        const formattedNews = data.result.map((item) => ({
          ...item,
          formatedCreatedAt: formatDate(item.createdAt),
        }));
  
        setNews(formattedNews);
        setTotalPages(data.totalPages);
        setCurrentPage(page);
    }
      } catch (err) {
        console.error(err.message);
      }
    };
  
    const handleFilter = () => {
      getAll(); // Fetch news with applied filters
    };

    const handleHighlightToggle = () => {
        toggleHighlight(!highlightEnabled); // Toggle highlight state
      };
  
    useEffect(() => {
      getScore()
      getAll(); // Fetch news on initial load
    }, []);
  
    const renderPagination = () => {
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <li
            className={`page-item ${i === currentPage ? "active" : ""}`}
            key={i}
          >
            <button className="page-link" onClick={() => getAll(i)}>
              {i}
            </button>
          </li>
        );
      }
      return (
        <nav aria-label="Page navigation">
          <ul className="pagination justify-content-start">
            {pages}
            {currentPage < totalPages && (
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={() => getAll(currentPage + 1)}
                >
                  Next
                </button>
              </li>
            )}
          </ul>
        </nav>
      );
    };
  
    return (
      <>
    

        <>
        <div className="page-title lb single-wrapper">
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-lg-8 col-md-10 col-sm-12 col-xs-12 text-center">
        <h2 className="display-4 font-weight-bold text-primary mb-4">
          <Newspaper color="orange" size={32} className="mr-3" />
          Новини сравнени с тези на БТА
        </h2>
        <p className="lead text-muted mb-4">
          Актуални новини с подробен анализ на сензационни изрази и думи.
        </p>
      </div>
    </div>
    <div className="row justify-content-center">
  <div className="col-lg-8 col-md-10 col-sm-12">
    <div className="news-summary bg-white p-4 rounded-lg shadow-lg">
      <h3 className="font-weight-bold mb-4 text-dark" style={{ textAlign: 'center' }}>
        Обобщение на новините:
      </h3>
      <div className="news-item mb-4 p-3 border rounded-lg shadow-sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px' }}>
        <p className="text-muted" style={{ textAlign: 'center', margin: 0 }}>
          <strong>{score[0]?.stats[0]}</strong> от <strong>{score[0]?.stats[1]}</strong> новини от <strong>Медиапул</strong> съдържат сензационни изрази и думи.  - {Math.ceil((score[0]?.stats[0]/score[0]?.stats[1])*100)} %
        </p>
      </div>
      <div className="news-item mb-4 p-3 border rounded-lg shadow-sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px' }}>
        <p className="text-muted" style={{ textAlign: 'center', margin: 0 }}>
          <strong>{score[1]?.stats[0]}</strong> от <strong>{score[1]?.stats[1]}</strong> новини от <strong>Пик</strong> съдържат сензационни изрази и думи.  - {Math.ceil((score[1]?.stats[0]/score[1]?.stats[1])*100)} %
        </p>
      </div>
      <div className="news-item mb-4 p-3 border rounded-lg shadow-sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px' }}>
        <p className="text-muted" style={{ textAlign: 'center', margin: 0 }}>
          <strong>{score[2]?.stats[0]}</strong> от <strong>{score[2]?.stats[1]}</strong> новини от <strong>Българско национално радио</strong> съдържат сензационни изрази и думи. - {Math.ceil((score[2]?.stats[0]/score[2]?.stats[1])*100)} %
        </p>
      </div>
      <div className="news-item mb-4 p-3 border rounded-lg shadow-sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px' }}>
        <p className="text-muted" style={{ textAlign: 'center', margin: 0 }}>
          <strong>{score[3]?.stats[0]}</strong> от <strong>{score[3]?.stats[1]}</strong> новини от <strong>Дунавмост</strong> съдържат сензационни изрази и думи.  - {Math.ceil((score[3]?.stats[0]/score[3]?.stats[1])*100)} %
        </p>
      </div>
      <div className="news-item mb-4 p-3 border rounded-lg shadow-sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80px' }}>
        <p className="text-muted" style={{ textAlign: 'center', margin: 0 }}>
          <strong>{score[4]?.stats[0]}</strong> от <strong>{score[4]?.stats[1]}</strong> новини от <strong>24 часа</strong> съдържат сензационни изрази и думи.  - {Math.ceil((score[4]?.stats[0]/score[4]?.stats[1])*100)} %
        </p>
      </div>
    </div>
  </div>
</div>





  </div>
</div>


        </>
  
        <section className="section">
          <div className="container">
            {/* Date Filter Inputs */}
            <div className="row mb-4" style={{ display: "flex", alignItems: "flex-end" }}>
  <div className="col-md-4">
    <label
      htmlFor="fromDate"
      style={{
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
        marginLeft: '3px',
        fontSize: '16px',
      }}
    >
      Начална дата
    </label>
    <input
      id="fromDate"
      type="date"
      value={fromDate}
      onChange={(e) => setFromDate(e.target.value)}
      className="form-control"
      style={{
        borderRadius: "8px",
        height: "48px",
        textAlign: "center",
      }}
      placeholder="Начална дата"
    />
  </div>

  <div className="col-md-4">
    <label
      htmlFor="toDate"
      style={{
        display: "block",
        marginBottom: "8px",
        fontWeight: "bold",
        marginLeft: '3px',
        fontSize: '16px',
      }}
    >
      Крайна дата
    </label>
    <input
      id="toDate"
      type="date"
      value={toDate}
      onChange={(e) => setToDate(e.target.value)}
      className="form-control"
      style={{
        borderRadius: "8px",
        height: "48px",
        textAlign: "center",
      }}
      placeholder="Крайна дата"
    />
  </div>

  <div className="col-md-4" style={{ display: "flex", alignItems: "flex-end" }}>
    <button
      className="btn btn-primary w-100"
      style={{
        fontSize: "18px",
        height: "48px",
        borderRadius: "8px",
      }}
      onClick={handleFilter}
    >
      Приложете
    </button>
  </div>
</div>
<div className="row mb-4">
            <div className="col-md-12">
              <label
                style={{
                  marginBottom: "8px",
                  fontWeight: "bold",
                  marginLeft: "3px",
                  fontSize: "16px",
                  marginRight: "15px",
                }}
                htmlFor="highlightCheckbox"
              >
                Подсвети сензационните думи в новините
              </label>
              <input
                type="checkbox"
                id="highlightCheckbox"
                checked={highlightEnabled}
                onChange={() => handleHighlightToggle()} 
              />
            </div>
          </div>




  {dateError && (
    <div className="row">
        <div className="col-md-6">
            <p style={{ color: "red" }}>{dateError}</p>
        </div>
    </div>
)}
{news.length === 0 && (
    <h1 style={{ textAlign: "center", marginTop: "50px" }}>
      Няма налични новини
    </h1>
  )}
            <div className="row">
              <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12">
                <div className="page-wrapper">
                  <div className="blog-list clearfix">
                    {news.map((news, index) => (
                      <div
                        key={index}
                        className="blog-box row"
                        style={{ marginBottom: "25px" }}
                      >
                        {/* Unchanged content here */}
                        <div className="col-md-4">
                          <div className="post-media">
                            <a href="#" title="">
                                
                             {news.image_url != "undefined" ? (
                                                 <img
                                 src={`https://www.bta.bg/upload/` + news.image_url}
                                 alt={`${news.media} Logo`}
                                 className="img-fluid"
                               />):(                    <img
                                 src={CardBtaLogo}
                                 alt={`${news.media} Logo`}
                                 className="img-fluid"
                               />)}
                            </a>
                          </div>
                        </div>
                        <div className="blog-meta big-meta col-md-8">
                          <h4>
                            <Link to={`/news/${news._id}`}>
                              {news.title || "Title"}
                            </Link>
                          </h4>
                          <p>
                            {news.description.length > 194
                              ? news.description.substring(0, 194) + "..."
                              : news.description}
                          </p>
                          <small className="firstsmall">
                            {isFromYesterday(news.formatedCreatedAt) && (
                              <a className="bg-orange" href="#" title="">
                                От вчера
                              </a>
                            )}
                          </small>
                          <small>
                            <a href={news.link} title="">
                              {news.formatedCreatedAt}
                            </a>
                          </small>
                          <small>
                            <a href={news.authorLink} title="">
                              Публикувано от {news.media}
                            </a>
                          </small>
                        </div>
                      </div>
                    ))}
                    <hr className="invis" />
                  </div>
                </div>
              </div>
            </div>
            <div className="page-info ">
    Страница <span className="current-page">{currentPage}</span> от <span className="total-pages">{totalPages}</span>
</div>
            <div className="row justify-content-center">
              <div className="col-auto">{renderPagination()}</div>
            </div>
          </div>
        </section>
      </>
    );
  }
  