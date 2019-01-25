import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import Gitalk from 'gitalk'
import classNames from 'classnames/bind'

import { Transition, Archive, Quote, Pagination, Loading } from '../../components'
import config from '../../config'
import styles from './index.less'

const { gitalkOption, catsOption, themeColors } = config
const { enableGitalk, qoute, list } = catsOption
const cx = classNames.bind(styles)
const colors = _.shuffle(themeColors)

class Categories extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showLoading: true,
      renderGitalk: false,
      filterTitle: '',
      filterPost: [],
      currList: [],
      pageSize: 10,
      page: 1,
      maxPage: 1
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'app/queryCats'
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading && nextProps.cats.length) {
      this.setState({ showLoading: false })
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'app/updateState',
      payload: { cats: [] }
    })
  }

  // 筛选文章
  filterPost = cat => {
    this.props
      .dispatch({
        type: 'app/filterPost',
        payload: {
          type: 'milestone',
          filter: cat.number
        }
      })
      .then(v => {
        const currList = v.slice(0, this.state.pageSize)
        const maxPage = Math.ceil(v.length / this.state.pageSize)
        this.setState({
          filterTitle: cat.title,
          filterPost: v,
          currList,
          page: 1,
          maxPage
        })
      })
      .catch(console.error)
  }

  // 清空文章
  clearFilter = () => {
    this.setState({
      filterTitle: '',
      filterPost: [],
      currList: [],
      page: 1,
      maxPage: 1
    })
  }

  // 前一页
  prev = () => {
    const { filterPost, page, pageSize } = this.state
    const prevPage = page - 1
    const currList = filterPost.slice((prevPage - 1) * pageSize, (page - 1) * pageSize)
    this.setState({
      currList,
      page: prevPage
    })
  }

  // 后一页
  next = () => {
    const { filterPost, page, pageSize } = this.state
    const nextPage = page + 1
    const currList = filterPost.slice(page * pageSize, nextPage * pageSize)
    this.setState({
      currList,
      page: nextPage
    })
  }

  // 渲染评论
  renderGitalk = () => {
    if (enableGitalk && !this.state.renderGitalk) {
      setTimeout(() => {
        const gitalk = new Gitalk({
          ...gitalkOption,
          title: '分类'
        })
        gitalk.render('gitalk')
      }, 100)
      this.setState({ renderGitalk: true })
    }
  }

  render({ cats, loading }, { showLoading, filterTitle, currList, page, maxPage }) {
    return (
      <div class={cx('container')}>
        <Transition
          visible={!loading && !showLoading}
          animation="drop"
          duration={600}
          onShow={this.renderGitalk}
        >
          <div class={cx('body')}>
            <Quote text={qoute} />
            <div class={cx('content')}>
              {cats.map((o, i) => {
                const info = list.find(cat => cat.name === o.title)
                const catText = info.text
                const catImg = info.img
                return (
                  <div
                    key={i}
                    class={cx('cat')}
                    onClick={() => {
                      this.filterPost(o)
                    }}
                  >
                    <img class={cx('bg')} src={catImg} alt="" />
                    <div class={cx('meta')}>
                      <div class={cx('header')}>
                        <img class={cx('avatar')} src={catImg} alt="" />
                        <span>
                          {o.title} ({o.open_issues})
                        </span>
                      </div>
                      <p class={cx('desc')}>{catText}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <Transition visible={currList.length} animation="fade down" duration={600}>
              <div>
                <div>
                  <span>Category:</span>
                  <button class={cx('menu-btn')} onClick={this.clearFilter}>
                    {filterTitle}
                    <i class="icon">&#xe806;</i>
                  </button>
                </div>
                <div class={cx('content')}>
                  {currList.map((o, i) => {
                    const color = colors[i]
                    return <Archive key={i} color={color} {...o} />
                  })}
                </div>
                <Pagination prev={this.prev} next={this.next} page={page} maxPage={maxPage} />
              </div>
            </Transition>
          </div>
        </Transition>

        {enableGitalk && <div id="gitalk" />}
        {showLoading && <Loading className={cx('loading')} />}
      </div>
    )
  }
}

export default connect(({ app, loading }) => ({
  cats: app.cats,
  loading: loading.effects['app/queryCats']
}))(Categories)
