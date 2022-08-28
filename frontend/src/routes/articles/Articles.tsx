import React, { useEffect, useState } from 'react'
import getArticles from '../../api/articles'
import { Article } from '../../data/article'
import { host } from '../../util/constants'
import NumberPagination from '../../components/NumberPagination/NumberPagination'
import { formatToLocalDate } from '../../util/functions'
import { useGeneralContext } from '../../contexts/generalState'

import './Articles.scss'

interface ArticleState {
  articles: Article[]
  loading: boolean
}

function Articles() {
  const [articleRequest, setArticleRequest] = useState<ArticleState>({ articles: [], loading: false })
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const { backgroundImages } = useGeneralContext()

  useEffect(() => {
    ;(async () => {
      setArticleRequest({ articles: [], loading: true })
      getArticles(page).then((response) => {
        setArticleRequest({ articles: response.articles, loading: false })
        setTotalPages(response.pageCount)
      })
    })()
  }, [page])

  const { loading, articles } = articleRequest

  const renderArticleContainer = () => {
    return (
      <div className="article-wrapper default-container">
        {loading && <div className="spinner-border" role="status" />}
        {articles.map((article) => {
          return (
            <div className="article-card" key={article.id}>
              {article.smallImg && (
                <div className="cover-img">
                  <img src={`${host}${article.smallImg}`} alt="cover" />
                </div>
              )}
              <div className="article-card-content">
                <div className="article-title">{article.title}</div>
                <div className="article-date-author">
                  <span>{formatToLocalDate(article.publishedAt)}</span>
                  <span>{article.author}</span>
                </div>
                <div className="article-content">{article.summary.slice(0, 150)}</div>
              </div>
            </div>
          )
        })}
        {!loading ? <NumberPagination totalPages={totalPages} currentPage={page} setPage={setPage} /> : ''}
      </div>
    )
  }

  return (
    <div className="articles-page page-content" style={{ backgroundImage: `url(${host}${backgroundImages.home}` }}>
      <div className="left-title-section with-margin">
        <span className="bold-title">Articole</span>
      </div>
      {renderArticleContainer()}
    </div>
  )
}

export default Articles
