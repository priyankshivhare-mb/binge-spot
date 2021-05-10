import React from "react";
import axios from "axios";
import {flattenDeep, find} from "lodash";
import {Text, TextInput, View, StyleSheet, Pressable} from "react-native";
import {API_KEY, ratingSources, sourcesEnum} from "../constants/config";

class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            movieTitle: '',
            imdb: '',
            rottenTomatoes: '',
            metaCritic: '',
            showWarning: false,
            titleSuggestions: []
        };
    }

    handleTitleChange = movieTitle => {
        this.setState({movieTitle, imdb: '', rottenTomatoes: '', metaCritic: '', showWarning: false});
        if (movieTitle.length >= 3) {
            axios.get(`http://www.omdbapi.com?s=${movieTitle}&apikey=${API_KEY}`).then(response => {
                const searchArr = response.data.Search;
                if (searchArr) {
                    const titleSuggestions = searchArr.map(movieData => movieData.Title);
                    console.log(titleSuggestions);
                    this.setState({titleSuggestions});
                }
            });
        } else {
            this.setState({titleSuggestions: []});
        }
    };

    handleOnSubmit = () => {
        let {movieTitle} = this.state;
        movieTitle = movieTitle.trim().replace(' ', '+');

        axios.get(`http://www.omdbapi.com/?t=${movieTitle}&apikey=${API_KEY}`).then((response) => {
            const data = response.data;
            const movieRatings = flattenDeep(data.Ratings);
            const ratings = ratingSources.reduce((acc, source) => {
                const filteredRecord = movieRatings.find(record => record.Source === source);
                if (filteredRecord) {
                    acc[sourcesEnum[filteredRecord.Source]] = filteredRecord.Value;
                }
                return acc;
            }, {});
            const {imdb, rottenTomatoes, metaCritic} = ratings;

            this.setState({imdb, rottenTomatoes, metaCritic, showWarning: true});
        }).catch(err => {
            console.log(err);
        });
    }

    handleAutoCompleteSelect = movieTitle => {
        this.setState({movieTitle, titleSuggestions: []});
    }

    render() {
        const {movieTitle, imdb, rottenTomatoes, metaCritic, showWarning, titleSuggestions} = this.state;

        return (
            <View style={styles.container}>
                <Text style={styles.heading}>Get ratings</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter movie title"
                    onChangeText={this.handleTitleChange}
                    defaultValue={movieTitle}
                />
                {
                    titleSuggestions.length > 0 && (
                        titleSuggestions.map(title => (
                            <Pressable
                                keyExtractor={title}
                                onPress={() => this.handleAutoCompleteSelect(title)}
                            >
                                <Text style={styles.dropdown}>{title}</Text>
                            </Pressable>
                        ))
                    )
                }

                <Pressable onPress={this.handleOnSubmit}>
                    <Text style={styles.button}>Submit</Text>
                </Pressable>
                {!imdb && !metaCritic && !rottenTomatoes && showWarning && (
                    <Text style={styles.noResult}>
                        No ratings found!
                    </Text>
                )}
                <Text style={styles.result}>
                    {imdb && `IMDB: ${imdb}`}
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
    },
    noResult: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'red',
    },
    dropdown: {
        backgroundColor: '#ddd',
        color: 'gray',
        padding: 10,
    }
});

export default HomeScreen;
