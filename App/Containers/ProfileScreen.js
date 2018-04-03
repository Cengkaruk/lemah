import React, { Component } from 'react'
import {
  StyleProvider,
  Container,
  Content,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Text,
  Thumbnail,
  Tabs,
  Tab,
  Spinner
} from 'native-base'
import { Col, Row, Grid } from 'react-native-easy-grid'
import PostList from '../Components/PostList'
import CommentList from '../Components/CommentList'
import { connect } from 'react-redux'
import AccountActions from '../Redux/AccountRedux'
import PostActions from '../Redux/PostRedux'

// Styles
import getTheme from '../Themes/NativeBase/components'
// import styles from './Styles/ProfileScreenStyle'

import Images from '../Themes/Images'

class ProfileScreen extends Component {
  componentDidMount () {
    this.props.getFollowList(this.props.profile.name)
    this.props.getPostProfile()
  }

  render () {
    const { goBack, navigate } = this.props.navigation
    let jsonMetadata = this.props.profile.json_metadata
    const profile = {
      name: jsonMetadata.profile.name,
      about: jsonMetadata.profile.about,
      image: jsonMetadata.profile.profile_image,
      followers: this.props.followers,
      following: this.props.following
    }
    return (
      <StyleProvider style={getTheme()}>
        <Container style={{ backgroundColor: '#EEEEEE' }}>
          <Header noShadow light>
            <Left>
              <Button onPress={() => goBack()}>
                <Icon name='ios-arrow-back' />
              </Button>
            </Left>
            <Body />
            <Right>
              <Button medium dark bordered>
                <Text>Follow</Text>
              </Button>
              <Button>
                <Icon name='ios-more' />
              </Button>
            </Right>
          </Header>
          <Content>
            <Grid style={{ backgroundColor: '#FFF' }}>
              <Row style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Thumbnail large source={{ uri: profile.image }} />
              </Row>
              <Row style={{ flexDirection: 'column', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F8F8F8' }}>
                <Text style={{ fontSize: 24 }}>{ profile.name }</Text>
                <Text>{ profile.about }</Text>
              </Row>
              <Row style={{ padding: 20 }}>
                <Col>
                  <Text note onPress={() => navigate('FollowScreen', { title: 'Followers', items: profile.followers })}>{ profile.followers.length } Followers</Text>
                </Col>
                <Col>
                  <Text note onPress={() => navigate('FollowScreen', { title: 'Following', items: profile.following })}>{ profile.following.length } Following</Text>
                </Col>
              </Row>
              <Row>
                { this.props.posts.fetching ? (
                  <Grid>
                    <Row style={{ justifyContent: 'center' }}>
                      <Spinner />
                    </Row>
                  </Grid>
                ) : (
                  <Tabs tabBarUnderlineStyle={{ backgroundColor: '#808080' }}>
                    <Tab
                      tabStyle={{ backgroundColor: '#FFF' }}
                      activeTabStyle={{ backgroundColor: '#FFF' }}
                      activeTextStyle={{ color: '#000' }}
                      heading='Latest'>
                      <PostList title={false} navigation={this.props.navigation} posts={this.props.posts.blog} />
                    </Tab>
                    <Tab
                      tabStyle={{ backgroundColor: '#FFF' }}
                      activeTabStyle={{ backgroundColor: '#FFF' }}
                      activeTextStyle={{ color: '#000' }}
                      heading='Comments'>
                      <CommentList navigation={this.props.navigation} comments={this.props.posts.comments} />
                    </Tab>
                  </Tabs>
                )}
              </Row>
            </Grid>
          </Content>
        </Container>
      </StyleProvider>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.account.profile,
    followers: state.account.followers,
    following: state.account.following,
    posts: state.posts
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getFollowList: (username) => dispatch(AccountActions.followListRequest(username)),
    getPostProfile: () => dispatch(PostActions.postProfileRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen)
