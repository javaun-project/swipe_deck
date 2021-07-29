import React from 'react';
import { View, Text, Animated, PanResponder, Dimensions, LayoutAnimation, UIManager, StyleSheet } from 'react-native';
import { Card, Button} from 'react-native-elements';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends React.Component {

  static defaultProps = {
    onSwipeRight: () => {},
    onSwipeLeft: () => {}
  }

  //default values
  constructor(props){
    super(props);

    const position = new Animated.ValueXY()
    //Handles left and right swipe gestures.
    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove:  (event, gesture) => {
          position.setValue({ x: gesture.dx, y: gesture.dy });
        },
        onPanResponderRelease: (event, gesture) => {
          if (gesture.dx > SWIPE_THRESHOLD){
            this.forceSwipe('right');
          } else if (gesture.dx < -SWIPE_THRESHOLD){
            this.forceSwipe('left');
          } else {
            this.resetPosition();
          }
            
        }
    })

    this.state = {panResponder, position, index: 0}
  }


  UNSAFE_componentWillReceiveProps(nextProps){
    //start with the first card
    if (nextProps.data !== this.props.data){
      this.setState({ index: 0});
    }
  }

  UNSAFE_componentWillUpdate(){
    //springs the next card into view.
    UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
  }


  forceSwipe(direction){
    //swipe the card off of the screen when the x variable reaches a certain value range.
    const x = direction === 'right' ? SCREEN_WIDTH: -SCREEN_WIDTH
    Animated.timing( this.state.position, {
      toValue: {x: x, y: 0},
      duration: SWIPE_OUT_DURATION
    }).start(() => this.onSwipeComplete(direction));
  }

  //This function prompts the deck to move to another card after the swipe gesture is completed.
  onSwipeComplete(direction){
    const { onSwipeLeft, onSwipeRight, data} = this.props;
    const item = data[this.state.index];

    direction === 'right' ? onSwipeRight(item): onSwipeLeft(item);
    this.state.position.setValue({x: 0, y: 0});
    this.setState({index: this.state.index + 1});
  }


  resetPosition(){
      Animated.spring(this.state.position,  {
        toValue: { x: 0, y: 0}
      }).start();
  }


  getCardStyle(){
    const { position } = this.state;
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 2.0, 0, SCREEN_WIDTH * 2.0],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate: rotate}]
    };
  }

  //loads the collection of cards
  renderCards(){
    if (this.state.index >= this.props.data.length){
        //This function gets called when there are no more cards to render.
        return(
          <Card title="All Done!">
            <Text style={{ marginBottom: 10}}>
              There's no more content. Please reset the deck.
            </Text>
            <Button
              title='Reset!'
              onPress={()=>{
                this.setState({index: 0})
              }}
            />
          </Card>
        )
    }

    //loads the data prop from app.js in reverse to start with card #1.
    return this.props.data.map((item , i)=> {
      if(i < this.state.index){ return null}
      if (i == this.state.index){
        return(
           <Animated.View 
              key={item.id}
              style={[this.getCardStyle(), styles.cardStyle]}
              //top card gets pan responder for swipe gestures.
              {...this.state.panResponder.panHandlers}>
              {this.props.renderCard(item)}
           </Animated.View>
        )
      }
      return (
        <View key={item.id} style={[styles.cardStyle, {top: 5 * (i - this.state.index)}]}>
          {this.props.renderCard(item)}
        </View>
      );
    }).reverse();
  }

  

  render(){
    return(
      <View>
        {this.renderCards()}
      </View>
    );
  }
}

export default Deck;

const styles = StyleSheet.create({

  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH,
 
  }
});
