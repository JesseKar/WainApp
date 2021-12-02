import React, { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import styled from 'styled-components';
import { AntDesign } from '@expo/vector-icons';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';
import { API_URL } from "@env"


const SUGGEST_URL = API_URL

const firebaseConfig = {
    apiKey: 'AIzaSyBW0CAZBOBd74YFeD-HkemzDiSE0sfGPco',
    authDomain: 'wainapp-15c95.firebaseapp.com',
    databaseURL: 'https://wainapp-15c95-default-rtdb.europe-west1.firebasedatabase.app/',
    projectID: 'wainapp',
    storageBucket: 'wainapp-15c95.appspot.com',
    messagingSenderId: '666700246264'
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export default function HomeScreen({ navigation }) {

    const [wines, setWines] = useState([])
    const [isUrl, setUrl] = useState(SUGGEST_URL)
    const [selectedIndex, setSelectedIndex] = useState([])

    const getSuggestions = () => {
        fetch(isUrl)
            .then((res) => res.json())
            .then((resJSON) => {
                const temp = shuffleArray(resJSON);
                setWines(temp.slice(0, 3));
                //console.log(resJSON);
            })
            .catch((err) => {
                Alert.alert('Unable to fetch wines, try again..')
            })
    }

    /* Randomize array in-place using Durstenfeld shuffle algorithm */
    const shuffleArray = (array) => {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    useEffect(() => {
        getSuggestions();
    }, [isUrl])

    const saveItem = (item) => {
        //console.log(item);
        push(ref(database, 'wines/'), {
            'name': item.name,
            'type': item.type,
            'img': item.img,
            'country': item.country,
            'description': item.description,
            'id': item.id,
        })
    }

    const removeItem = (item) => {
        //console.log(item.id, 'to be removed');
        onValue(ref(database, 'wines/'), (snapshot) => {
            const data = snapshot.val()
            if (data === null) {
                return;
            } else {
                const keyData = Object.entries(data)
                //console.log(keyData);
                for (const key of keyData) {
                    const dbKey = key[0]
                    if (key[1].id === item.id) {
                        remove(ref(database, 'wines/' + dbKey))
                        //console.log('data poistettu');
                    }
                }
            }
        })
    }


    const selectItem = (index, item) => {
        if (selectedIndex.indexOf(index) > -1) {
            let newArray = selectedIndex.filter((indexObject) => {
                if (indexObject === index) {
                    return false;
                }
                return true;
            })
            setSelectedIndex(newArray)
            removeItem(item)
        } else {
            setSelectedIndex([...selectedIndex, index])
            saveItem(item)
        }
    }

    return (
        <Container>
            <StatusBar barStyle="light-content" />
            <HomeBackground source={require('../assets/main_bottle.jpg')}>
                <SafeAreaView>
                    <Logo source={require('../assets/logo.png')} />
                    <SuggestionView>
                        <Text title bold>Etsi,</Text>
                        <Text title bold>Tutustu,</Text>
                        <Text title bold>Nauti</Text>
                    </SuggestionView>
                    <WineListContainer>
                        <Intro>
                            <Text small heavy>Oletko jo kokeillut näitä?</Text>
                        </Intro>
                        <Wines
                            keyExtractor={item => item.id}
                            extraData={selectedIndex}
                            ListHeaderComponent={() => (!wines.length ?
                                <ActivityIndicator size='large' color='#FFF' /> : null)}
                            renderItem={({ item, index }) => (
                                <Wine>
                                    <WineImage source={{ uri: item.img }} />
                                    <WineInfo onPress={() => navigation.navigate('ItemViewer', { wine: item, from: 'HomeScreen' })}>
                                        <Text large heavy >{item.name}</Text>
                                        <Text small bold >{item.country} | {item.type}</Text>
                                    </WineInfo>
                                    <AntDesign name={selectedIndex.indexOf(index) > -1 ? 'heart' : 'hearto'} size={24} color='#FFF' onPress={() => selectItem(index, item)} />
                                </Wine>
                            )}
                            data={wines}
                        />
                    </WineListContainer>
                </SafeAreaView>
            </HomeBackground>
        </Container>
    )
}

const Container = styled.View`
    flex: 1;
    background-color: #FFF;
`;

const HomeBackground = styled.ImageBackground`
    width: 100%;
    height: 100%;
`;

const Logo = styled.Image`
    width: 80%;
    height: 120px;
    justify-content: space-between;
    align-items: center;
    margin: 16px 0 0 40px;
`;

const Text = styled.Text`
    color: ${(props) => (props.dark ? "#000" : "#FFF")};

    ${({ title, large, small }) => {
        switch (true) {
            case title:
                return `font-size: 26px`;
            case large:
                return `font-size: 20px`;
            case small:
                return `font-size: 16px`;
        }
    }}

    ${({ bold, heavy }) => {
        switch (true) {
            case bold:
                return `font-weight: 600`;
            case heavy:
                return `font-weight: 700`;
        }
    }}
`;

const SuggestionView = styled.View`
    margin: 25px 0 10px 0;
    align-items: center;
`;

const WineListContainer = styled.View`
    padding: 8px;
    margin: 16px 5px 16px 5px;
    border-radius: 20px;
`;

const Wines = styled.FlatList`
    margin: 0;
`;

const Wine = styled.View`
    height: 110px;
    margin-bottom: 8px;
    flex-direction: row;
    align-items: center;
    border-width: 1px;
    border-radius: 10px;
    padding: 5px;
    background-color: #000;
`;

const WineImage = styled.Image`
    width: 90px;
    height: 90px;
    border-radius: 8px;
`;

const WineInfo = styled.TouchableOpacity`
    flex: 1;
    margin-left: 12px;
    margin-right: 16px;
`;

const Intro = styled.View`
    align-items: center;
    padding: 5px;
`;



