/* eslint-disable arrow-parens */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react'
import axios from 'axios'
import { appendFile } from 'fs'

const api = axios.create({
  baseURL: 'http://localhost:1337/articles'
})

class Articles extends Component {

    state = {
      articles: []
    }

  constructor() {
    super();
    this.getArticles();
  }

  getArticles = async () => {
    try {
      let data = await axios({
          method: 'get',
          url: 'http://localhost:1337/articles'
      }).then(({data}) => data);
      
      //api.get('/').then(({data}) => data);
      this.setState({articles: data})
    } catch (err)
    {
      console.log(err)
    }
  }

  render() {
    return (
      <div className="Articles">
        <ul>
          {this.state.articles.map(article =><li key={article.id}>{article.Title}</li>)}
        </ul>
      </div>
    );
  }
}

export default Articles
