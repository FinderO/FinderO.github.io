import React, { PureComponent } from 'react'
import { connect } from 'dva'
import styled from 'styled-components'
import { Transition, Button } from 'semantic-ui-react'
import ArchiveList from '../components/archiveList'
import Quote from '../components/quote'
import Loading from '../components/loading'

const Container = styled.div`
  margin: 0 auto;
  padding: 16px;
  border-radius: 3px;
  box-shadow: 0 3px 6px rgba(0,0,0,.16), 0 3px 6px rgba(0,0,0,.23);
  background: rgba(255, 255, 255, .6);
  @media (max-width: 900px) {
    width: 96%;
  }
`

const Pagination = styled.div`
  margin-top: 10px;
  text-align: center;
  button {
    background: rgba(255, 255, 255, .6)!important;
    &:hover {
      box-shadow: 0 0 40px #999 inset!important;
    }
  }
`

class Archives extends PureComponent {
  componentDidMount() {
    this.props.dispatch({
      type: 'site/queryTotal'
    })
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'site/reset',
      payload: {
        archivesOnHide: false,
        loading: true,
        total: 0,
        page: 0,
        archives: [],
      }
    })
  }

  // 前一页
  prev = () => {
    this.props.dispatch({
      type: 'site/queryArchives',
      payload: {
        queryType: 'prev',
      }
    })
  }

  // 后一页
  next = () => {
    this.props.dispatch({
      type: 'site/queryArchives',
      payload: {
        queryType: 'next',
      }
    })
  }

  onHide = () => {
    this.props.dispatch({
      type: 'site/update',
      payload: {
        archivesOnHide: true,
      }
    })
  }

  render() {
    const { archivesOnHide, loading, archives, total, page, pageSize } = this.props
    const maxPage = Math.ceil(total / pageSize)
    const text = '文章千古事，得失寸心知'
    return (
      <Container>
        <Transition visible={!loading} animation='scale' duration={800} onHide={this.onHide}>
          <div>
            <Quote text={text} />
            <ArchiveList archives={archives} />
            <Pagination>
              <Button.Group>
                <Button disabled={page <= 1} onClick={this.prev}>上一页</Button>
                <Button.Or text={page} />
                <Button disabled={page >= maxPage} onClick={this.next}>下一页</Button>
              </Button.Group>
            </Pagination>
          </div>
        </Transition>
        {(!archives || archives.length === 0 || archivesOnHide)&&
          <Loading />
        }
      </Container>
    )
  }
}

export default connect(({ site }) => ({ ...site }))(Archives)
