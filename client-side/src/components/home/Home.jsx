import { useEffect, useState } from "react";
import BigBtaLogo from '../../assets/images/BTA-Logo-site-788.png';
import SmallBtaLogo from '../../assets/images/BTA-Logo-site-394.png';
import CardBtaLogo from '../../assets/images/BTA-Logo-site-600.png';
import { Rss } from "react-bootstrap-icons";
import { formatDate, isFromYesterday } from "../../utils/formatDate";
import * as newsService from "../../services/newsService";
import { Link } from "react-router-dom";

export function Home() {
    const [news, setNews] = useState([]);
   useEffect(() => {
           const getAll = async () => {
               try {
                   const fetchData = await newsService.getNews(); // Await the fetch call
                   const data = await fetchData.json(); // Await the .json() method
                   
                   // Format the date for each news item
                   const formattedNews = data.result.map(item => ({
                       ...item,
                       formatedCreatedAt: formatDate(item.createdAt) // Add a new formatted date field
                   }));
                   
                   setNews(formattedNews); // Set the formatted result in the state
                   console.log(news[0]);
                   
               } catch (err) {
                   console.error(err.message); // Use console.error for error logging
               }
           }
           getAll();
       }, []); // Empty dependency array ensures this runs only once
      
    return (
      <>
 <section className="section first-section" style={{marginTop:'50px'}}>
          <div className="container-fluid">
            <div className="masonry-blog clearfix">
              
              <div className="first-slot">
                <div className="masonry-box post-media">
                { news[0]?.image_url != "undefined" ? (
                    <img
    src={`https://www.bta.bg/upload/` +  news[0]?.image_url}
    alt={`${news[0]?.media} Logo`}
    style={{height: "449px", objectFit: "cover"}}
    className="img-fluid"
  />):(                    <img
    src={BigBtaLogo}
    alt={`${ news[0]?.media} Logo`}
    className="img-fluid"
  />)}
                  <div className="shadoweffect">
                    <div className="shadow-desc">
                      <div className="blog-meta">
                        <span className="bg-orange">
                          <a href="#" title="" style={{fontSize:'18px'}}>
                          Последна новина

                          </a>
                        </span>
                        <h4>
                        <Link to={"/news/" + news[0]?._id}>
                            {news[0]?.title || "Title"}
                            </Link>
                        </h4>
                        <small>
                          <a href="#" title="">
                            {news[0]?.formatedCreatedAt || "Default Date"}
                          </a>
                        </small>
                        <small>
                          <a href="#" title="">
                            Публикувано от {news[0]?.media || "Default Author"}
                          </a>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="second-slot">
                <div className="masonry-box post-media">
                { news[1]?.image_url != "undefined" ? (
                    <img
    src={`https://www.bta.bg/upload/` +  news[1]?.image_url}
    alt={`${news[1]?.media} Logo`}
    className="img-fluid"
    style={{height: "449px", objectFit: "cover"}}

  />):(                    <img
    src={SmallBtaLogo}
    alt={`${ news[1]?.media} Logo`}
    className="img-fluid"
  />)}
                  <div className="shadoweffect">
                    <div className="shadow-desc">
                      <div className="blog-meta">
                        <span className="bg-orange">
                          <a href="#" title="" style={{fontSize:'18px'}}>
                          Последна новина

                          </a>
                        </span>
                        <h4>
                        <Link to={"/news/" + news[1]?._id}>
                            {news[1]?.title || "Title"}
                            </Link>
                        </h4>
                        <small>
                          <a href="#" title="">
                            {news[1]?.formatedCreatedAt || "Date"}
                          </a>
                        </small>
                        <small>
                          <a href="#" title="">
                          Публикувано от {news[1]?.media || "Author"}
                          </a>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="last-slot">
                <div className="masonry-box post-media">
                { news[2]?.image_url != "undefined" ? (
                    <img
    src={`https://www.bta.bg/upload/` +  news[2]?.image_url}
    alt={`${news[2]?.media} Logo`}
    className="img-fluid"
    style={{height: "449px", objectFit: "cover"}}

  />):(                    <img
    src={SmallBtaLogo}
    alt={`${ news[2]?.media} Logo`}
    className="img-fluid"
  />)}
                  <div className="shadoweffect">
                    <div className="shadow-desc">
                      <div className="blog-meta">
                        <span className="bg-orange">
                          <a href="#" title="" style={{fontSize:'18px'}}>
                            Последна новина
                          </a>
                        </span>
                        <h4>
                        <Link to={"/news/" + news[2]?._id}>
                            {news[2]?.title || "Title"}
                            </Link>
                        </h4>
                        <small>
                          <a href="#" title="">
                            {news[2]?.formatedCreatedAt || "Date"}
                          </a>
                        </small>
                        <small>
                          <a href="#" title="">
                          Публикувано от {news[2]?.media || "Author"}
                          </a>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
        <section className="section">
  <div className="container">
    <div className="row">
      <div className="col-lg-9 col-md-12 col-sm-12 col-xs-12">
        <div className="page-wrapper">
          <div className="blog-top clearfix">
            <h4 className="pull-left" style={{fontSize:'24px'}}>
              Последни новини{" "}
              <Rss color="orange" size={24} />
            </h4>
          </div>
          {/* end blog-top */}
          <div className="blog-list clearfix">
            {news.slice(3).map((news, index) => (
              <div key={index} className="blog-box row" style={{marginBottom:'25px'}}>
                <div className="col-md-4">
                  <div className="post-media">
                    <a href='#' title="">
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
                      <div className="hovereffect" />
                    </a>
                  </div>
                </div>
                <div className="blog-meta big-meta col-md-8">
                <h4>
                        <Link to={"/news/" + news._id}>
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
                    <a href='#' title="">
                      {news.formatedCreatedAt}
                    </a>
                  </small>
                  <small>
                    <a href='#' title="">
                      Публикувано от {news.media}
                    </a>
                  </small>
                 
                </div>

              </div>
              
            ))}
            {/* end blog-box */}
            <hr className="invis" />
            {/* Add banner or other content as needed */}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


      </>
    )
}