/* eslint-disable arrow-parens */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import React from 'react'
import axios from 'axios'

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNjQzMDE2NDU5LCJleHAiOjE2NDU2MDg0NTl9.q2myjs8Iad2AI7g-EUWDoF8RZeEOSjQeEHBupvFJttg';
const baseURL = 'https://adventistclujro-strapi-test.azurewebsites.net';
const config = {
  headers: { Authorization: `Bearer ${token}` }
};

class Articles extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      articles: []
    }
    this.myArticles = this.myArticles.bind(this)
    this.myArticles()
  }

 myArticles() {
    axios.get(baseURL + '/articles', config)
    .then(res => this.setState({articles: res.data})).catch(err => console.log(err))
  }
  render() {
    return (
      <div>
      <div>Articles</div>
      <ul>
        {this.state.articles.map(article => <li>{article.Title}</li>)}
      </ul>
      </div>
    )
  }
}

export default Articles
