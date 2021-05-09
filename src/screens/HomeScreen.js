import React from "react";
import axios from "axios";
import {Text, TextInput, View, StyleSheet, Pressable} from "react-native";

const API_KEY = '41afa174';

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {movieTitle: ''};
    }

    handleTitleChange = movieTitle => {
        this.setState({movieTitle})
    };

    handleOnSubmit = () => {
        const {movieTitle} = this.state;

        axios.get(`http://www.omdbapi.com/?t=${movieTitle}&apikey=${API_KEY}`).then((response) => {
            const data = response.data;
            const ratings = data.Ratings;
            const imdbRating = ratings.filter(record => record.Source === 'Internet Movie Database')[0].Value;
            const rottenTomatoes = ratings.filter(record => record.Source === 'Rotten Tomatoes')[0].Value;
            const metaCritic = ratings.filter(record => record.Source === 'Metacritic')[0].Value;

            this.setState({imdbRating, rottenTomatoes, metaCritic});
        });
    }

    render() {
        const {movieTitle, imdbRating, rottenTomatoes, metaCritic} = this.state;

        return (
            <View>
                <Text style={styles.text}>Get ratings</Text>
                <TextInput
                    style={{height: 40}}
                    placeholder="Enter movie title"
                    onChangeText={this.handleTitleChange}
                    defaultValue={movieTitle}
                />
                <Pressable onPress={this.handleOnSubmit}>
                    <Text>Submit</Text>
                </Pressable>
                <Text>
                    {imdbRating && `IMDB: ${imdbRating}`}
                </Text>
                <Text>
                    {metaCritic && `Meta Critic: ${metaCritic}`}
                </Text>
                <Text>
                    {rottenTomatoes && `Rotten Tomatoes: ${rottenTomatoes}`}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        fontSize: 30
    }
});

export default HomeScreen;
