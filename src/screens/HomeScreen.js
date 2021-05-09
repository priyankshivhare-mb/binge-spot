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
            <View style={styles.container}>
                <Text style={styles.heading}>Get ratings</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter movie title"
                    onChangeText={this.handleTitleChange}
                    defaultValue={movieTitle}
                />
                <Pressable onPress={this.handleOnSubmit}>
                    <Text style={styles.button}>Submit</Text>
                </Pressable>
                <Text style={styles.result}>
                    {imdbRating && `IMDB: ${imdbRating}`}
                </Text>
                <Text style={styles.result}>
                    {metaCritic && `Meta Critic: ${metaCritic}`}
                </Text>
                <Text style={styles.result}>
                    {rottenTomatoes && `Rotten Tomatoes: ${rottenTomatoes}`}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      padding: 10,
    },
    heading: {
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center'
    },
    input: {
        width: '100%',
        borderBottomWidth: 1,
        marginTop: 20,
    },
    button: {
        backgroundColor: 'blue',
        width: '100%',
        height: '30%',
        marginTop: 30,
        textAlign: 'center',
        padding: 10,
        color: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    result: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default HomeScreen;
