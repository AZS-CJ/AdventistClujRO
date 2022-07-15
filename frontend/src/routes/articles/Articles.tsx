import React from 'react'
import './Articles.scss'
import getArticles from '../../api/articles'
import { Article } from '../../data/article'
import { LINKS } from '../../util/constants'

interface IState {
  articles: Article[]
  loading: boolean
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Articles extends React.Component<any, IState> {
  constructor(props) {
    super(props)
    this.state = { articles: [], loading: true }
  }

  async componentDidMount() {
    const articles = await getArticles()
    this.setState({ loading: false, articles: articles })
  }

  render() {
    return (
      <div className="articles-page">
        <div className="left-title-section">
          <span className="bold-title"> Articole </span>
        </div>
        {this.state.loading && <div className="spinner-border" role="status"></div>}
        {this.state.articles.length ? this.renderArticleContainer() : ''}
      </div>
    )
  }

  renderArticleContainer() {
    return (
      <div className="article-wrapper">
        <div className="article-list">
          {this.state.articles.map((article) => {
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
        </div>
      </div>
    )
  }
}

export default Articles
