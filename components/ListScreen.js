import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, Alert, ActivityIndicator, LogBox } from 'react-native';
import { SearchFilter } from "./SearchFilter";
import styled from 'styled-components';
import { AntDesign } from '@expo/vector-icons';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';
import { API_URL, API_KEY } from "@env";

LogBox.ignoreLogs(['Setting a timer']);

const BASE_URL = API_URL

const firebaseConfig = {
    apiKey: API_KEY,
    authDomain: 'wainapp-15c95.firebaseapp.com',
    databaseURL: 'https://wainapp-15c95-default-rtdb.europe-west1.firebasedatabase.app/',
    projectID: 'wainapp',
    storageBucket: 'wainapp-15c95.appspot.com',
    messagingSenderId: '666700246264'
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export default function ListScreen({ navigation }) {
    const [search, setSearch] = useState()
    const [wines, setWines] = useState([])
    const [isFilterVisible, setFilterVisible] = useState(false)
    const [isType, setType] = useState('all')
    const [selectedCountry, setSelectedCountry] = useState('None')
    const [isUrl, setUrl] = useState(BASE_URL);
    const [selectedIndex, setSelectedIndex] = useState([])


    const getWines = () => {
        fetch(isUrl)
            .then((res) => res.json())
            .then((resJSON) => {
                setWines(shuffleArray(resJSON));
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
        getWines()
    }, [isUrl])
    //console.log(wines[0]);

    const toggleModal = () => {
        setFilterVisible(!isFilterVisible)
    }

    const handleSearch = () => {
        if (search === undefined) {
            Alert.alert('Empty search field..')
            getWines()
        } else {
            const list = []
            for (const wine of wines) {
                if (wine.name.toLowerCase().includes(search.toLowerCase())) {
                    //console.log(wine);
                    list.push(wine)
                }
            }
            setWines(list)
            setSearch()
        }
    }

    const resetSearch = () => {
        setUrl(BASE_URL)
        getWines()
    }


    const saveItem = (item) => {
        //console.log(item);
        push(ref(database, 'wines/'), {
            'name': item.name,
            'type': item.type,
            'img': item.img,
            'country': item.country,
            'description': item.description,
            'id': item.id
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
            <SafeAreaView>
                <SearchContainer>
                    <SearchBar>
                        <SearchInput placeholder='search..' value={search} onChangeText={(text) => setSearch(text)} />
                        <AntDesign name="search1" size={35} color='#fff' onPress={handleSearch} />
                        <AntDesign name="filter" size={35} color='#fff' onPress={toggleModal} />
                    </SearchBar>
                </SearchContainer>
                <WineListContainer>
                    <Wines
                        keyExtractor={item => item.id}
                        ListHeaderComponent={() => (!wines.length ?
                            <ActivityIndicator size='large' color='#000' /> : null)}
                        renderItem={({ item, index }) => (
                            <Wine>
                                <WineImage source={{ uri: item.img }} />
                                <WineInfo onPress={() => navigation.navigate('ItemViewer', { wine: item, from: 'ListScreen' })} >
                                    <Text small heavy dark>{item.name}</Text>
                                    <Text bold dark>{item.country} | {item.type}</Text>
                                </WineInfo>
                                <AntDesign name={selectedIndex.indexOf(index) > -1 ? 'heart' : 'hearto'} size={24} color='#000' onPress={() => selectItem(index, item)} />
                            </Wine>
                        )}
                        ItemSeparatorComponent={Divider}
                        data={wines}
                    />
                    <SearchFilter
                        isFilterVisible={isFilterVisible}
                        isType={isType}
                        setType={setType}
                        toggleModal={toggleModal}
                        selectedCountry={selectedCountry}
                        setSelectedCountry={setSelectedCountry}
                        setUrl={setUrl}
                        isUrl={isUrl} />

                </WineListContainer>
            </SafeAreaView>
        </Container>
    );
}

const Container = styled.View`
    flex: 1;
    background-color: #FFF;
`;

const ListBackground = styled.ImageBackground`
    width: 100%;
    height: 100%;
`;

const Text = styled.Text`
    color: ${(props) => (props.dark ? "#000" : "#FFF")};

    ${({ title, large, small }) => {
        switch (true) {
            case title:
                return `font-size: 32px`;
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

const SearchContainer = styled.View`
    margin-top: 0px;
`;

const SearchBar = styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding: 16px;
    background-color: #000;
`

const SearchInput = styled.TextInput`
    width: 75%;
    height: 40px;
    background-color: #fff;
    border-radius: 10px;
    font-size: 20px;
    border-color: #000;
    border-width: 1px;
    padding: 10px;
`;

const WineListContainer = styled.View`
    background-color: #fff;
    padding: 16px;
    margin: 16px 10px 32px 10px;
    border-radius: 20px;
`;

const Wines = styled.FlatList`
    margin: 0 0 0 16px;
`;

const Wine = styled.View`
    margin-bottom: 16px;
    flex-direction: row;
    align-items: center;
`;

const WineImage = styled.Image`
    width: 80px;
    height: 80px;
    border-radius: 8px;
`;

const WineInfo = styled.TouchableOpacity`
    flex: 1;
    margin-left: 12px;
    margin-right: 16px;
`;

const Divider = styled.View`
    border-bottom-color: #000;
    border-bottom-width: 1px;
    width: 95%;
    margin: 8px 0;
`;

