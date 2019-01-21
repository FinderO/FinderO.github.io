import React, { PureComponent } from 'react'
import classNames from 'classnames/bind'
import baguetteBox from 'baguettebox.js'

import MarkeDown from '../MarkDown'
import styles from './index.less'

const cx = classNames.bind(styles)

class PostBody extends PureComponent {
  componentDidMount() {
    this.initLightBox()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.title !== this.props.title) {
      this.initLightBox()
    }
  }

  initLightBox = () => {
    baguetteBox.run('#post-body')
  }

  render({ title, date, cover, content, filterLabels, milestone, times }) {
    return (
      <div class={cx('container')} id="post-body">
        <div class={cx('header')}>
          <img alt="" src={cover.src} />
          <div class={cx('info')}>
            <h1>{title}</h1>
            <div class={cx('meta')}>
              <span>
                <i class="icon">&#xe808;</i>
                <span>{date}</span>
              </span>
              <span>
                <i class="icon">&#xf525;</i>
                <span>热度{times}℃</span>
              </span>
              <span>
                <i class="icon">&#xe802;</i>
                <span>{milestone && milestone.title ? milestone.title : '未分类'}</span>
              </span>
              <span>
                <i class="icon">&#xe807;</i>
                <span>
                  {filterLabels && filterLabels.map(o => <span key={o.id}>{o.name}</span>)}
                </span>
              </span>
            </div>
          </div>
        </div>
        {!!content && <MarkeDown className={cx('content')} content={content} />}
      </div>
    )
  }
}

export default PostBody
