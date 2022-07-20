import React, { useEffect, useState } from 'react'
import './Articles.scss'
import getArticles from '../../api/articles'
import { Article } from '../../data/article'
import { LINKS } from '../../util/constants'
import Pagination from '../../components/Pagination/Paginationo'

interface IState {
  articles: Article[]
  loading: boolean
}

function Articles() {
  const [articleRequest, setArticleRequest] = useState<IState>({ articles: [], loading: false })
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)

  useEffect(() => {
    ;(async () => {
      getArticles(page).then((articles) => {
        setArticleRequest({ articles: articles, loading: false })
        // set Page size from the response
        setTotalPages(5)
      })
    })()
  }, [page])

  const { loading, articles } = articleRequest

  const renderArticleContainer = () => {
    return (
      <div className="article-wrapper">
        {articles.map((article) => {
          return (
            <div className="article-card" key={article.id}>
              {article.img && (
                <div className="cover-img">
                  <img src={`${LINKS.stagingAPI}${article.img}`} alt="cover" />
                </div>
              )}
              <div className="article-card-content">
                <div className="article-title">{article.title}</div>
                <div className="article-date-author">
                  <span>{article.formattedDate}</span>
                </div>
                <div className="article-content">{article.content.slice(0, 100)}</div>
              </div>
            </div>
          )
        })}
        <Pagination totalPages={totalPages} currentPage={page} setPage={setPage} />
      </div>
    )
  }

  return (
    <div className="articles-page">
      <div className="left-title-section">
        <span className="bold-title"> Articole </span>
      </div>
      {loading && <div className="spinner-border" role="status"></div>}
      {articles.length ? renderArticleContainer() : ''}
    </div>
  )
}

export default Articles
