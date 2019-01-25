import React, { PureComponent } from 'react'
import { connect } from 'dva'
import _ from 'lodash'
import Gitalk from 'gitalk'
import classNames from 'classnames/bind'

import { Transition, Quote, Loading } from '../../components'
import config from '../../config'
import styles from './index.less'

const { gitalkOption, friendsOption } = config
const { enableGitalk, qoute } = friendsOption
const cx = classNames.bind(styles)

class Friends extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      showLoading: true,
      renderGitalk: false
    }
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'app/queryPage',
      payload: { type: 'friends' }
    })
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.loading && !_.isEmpty(nextProps.friends)) {
      this.setState({ showLoading: false })
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'app/updateState',
      payload: { friends: {} }
    })
  }

  // 渲染评论
  renderGitalk = () => {
    if (enableGitalk && !this.state.renderGitalk) {
      setTimeout(() => {
        const gitalk = new Gitalk({
          ...gitalkOption,
          title: '友链'
        })
        gitalk.render('gitalk')
      }, 100)
      this.setState({ renderGitalk: true })
    }
  }

  render({ friends, loading }, { showLoading }) {
    const section =
      friends.body &&
      friends.body
        .trim()
        .split('## ')
        .filter(o => o.length > 0)
        .map(o => {
          const content = o.split('\r\n').filter(o => o.length)
          return {
            name: content[0],
            link: content[1].split('link:')[1],
            cover: content[2].split('cover:')[1],
            avatar: content[3].split('avatar:')[1]
          }
        })

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
              {section &&
                section.map((o, i) => {
                  return (
                    <a key={i} href={o.link} rel="noopener noreferrer" target="_blank">
                      <img class={cx('cover')} alt="" src={o.cover} />
                      <div class={cx('info')}>
                        <img src={o.avatar} alt="" />
                        <span>{o.name}</span>
                      </div>
                    </a>
                  )
                })}
              {/* 添加四个空项目 */}
              {_.range(4).map((o, i) => {
                return (
                  <a
                    class="empty"
                    style="height: 0; margin: 0;"
                    key={i + 'empty'}
                    href={o.link}
                    rel="noopener noreferrer"
                    target="_blank"
                  />
                )
              })}
            </div>
          </div>
        </Transition>

        {enableGitalk && <div id="gitalk" />}
        {showLoading && <Loading className={cx('loading')} />}
      </div>
    )
  }
}

export default connect(({ app, loading }) => ({
  friends: app.friends,
  loading: loading.effects['app/queryPage']
}))(Friends)
