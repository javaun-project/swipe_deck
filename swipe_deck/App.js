import * as React from 'react';
import { Text, View, StyleSheet, Clipboard } from 'react-native';
import Constants from 'expo-constants';
import { Card, Button} from 'react-native-elements';
import Deck from './src/deck.js'; 



//local collection of images for the deck.
const DATA = [
  { id: 1, text: 'Card #1', uri: 'https://tse3.mm.bing.net/th?id=OIP.uzasBNwxum5G7YTfZZAFEQHaEK&pid=Api&P=0&w=309&h=175' },
  { id: 2, text: 'Card #2', uri: 'https://tse4.mm.bing.net/th?id=OIP.iI9yTTOCLApg9Y4FXueQ4wHaEo&pid=Api&P=0&w=295&h=185' },
  { id: 3, text: 'Card #3', uri: 'https://www.wallpapers13.com/wp-content/uploads/2020/09/Sunset-Airplane-Takeoff-Free-Images-for-Wallpapers-Hd-1024x768.jpg' },
  { id: 4, text: 'Card #4', uri: 'https://dynaimage.cdn.cnn.com/cnn/c_fill,g_auto,w_1200,h_675,ar_16:9/https%3A%2F%2Fcdn.cnn.com%2Fcnnnext%2Fdam%2Fassets%2F191120053137-03-milky-way-images-australia.jpg' },
  { id: 5, text: 'Card #5', uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSut5-GfJM60vbdTNFuB_jSw0Vx7_N-54TLkw&usqp=CAU' },
  { id: 6, text: 'Card #6', uri: 'https://www.w3schools.com/howto/img_snow.jpg' },
  { id: 7, text: 'Card #7', uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTfaJuXd05exiz7RMDHohhFRh7BySnxLAiGXA&usqp=CAU' },
  { id: 8, text: 'Card #8', uri: 'https://www.lamodeenimages.com/sites/default/files-lmi/styles/1365x768/public/images/article/homepage/full/miss-dior-exposition-love-nroses-shanghai-2019-la-mode-en-images-cover2.jpg?itok=iDaxTcAu' },
];





class App extends React.Component{
  //creation of each individual card.
  renderCard(item){
    return(
        <Card
          key={item.id} 
        >
          <Card.Title>{item.text}</Card.Title>
          <Card.Image  source={item.uri} style={{borderRadius: 5}}/>
          <Card.Title>Number of cards left: {DATA.length-item.id}</Card.Title>
          <Button
            title='Copy URL'
            style={{marginTop: 10}} 
            onPress={()=>{
              Clipboard.setString(item.uri)
            }}
          />
        </Card> 
    );
  }

  //Show the deck of cards
  render(){
    return (
      <View style={styles.container}>
          <Text style={{textAlign: 'center', fontSize: '20px'}}>Background Image Finder</Text>
          <Deck 
            data={DATA}
            renderCard={this.renderCard}
            renderNoMoreCards={this.renderNoMoreCards}
            onSwipeRight={() => console.log('something was swipped')}
          />
      </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff',
  },
});
