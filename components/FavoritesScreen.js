import React, { useEffect, useState } from "react";
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, remove } from 'firebase/database';
import { SafeAreaView, StatusBar } from 'react-native';
import styled from 'styled-components';
import { AntDesign } from '@expo/vector-icons';
import { API_KEY } from "@env"


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

export default function FavoritesScreen() {
    const [wines, setWines] = useState([])
    const [selectedIndex, setSelectedIndex] = useState([])


    //console.log(wines);

    useEffect(() => {
        const itemsRef = ref(database, 'wines/')
        onValue(itemsRef, (snapshot) => {
            const data = snapshot.val()
            //console.log('data', data);
            if (data === null) {
                setWines([])
            } else {
                setWines(Object.values(data))
            }
        })
    }, [])
    //console.log(wines[0]);


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

    if (wines.length < 1) {
        return <Text dark>You dont have any favorites yet, search redirection???</Text>
    }

    return (
        <Container>
            <StatusBar barStyle="light-content" />
            <SafeAreaView>
                <WineListContainer>
                    <Wines
                        keyExtractor={(item, index) => index}
                        renderItem={({ item, index }) => (
                            <Wine>
                                <WineImage source={{ uri: item.img }} />
                                <WineInfo >
                                    <Text small heavy dark>{item.name}</Text>
                                    <Text bold dark>{item.country} | {item.type}</Text>
                                </WineInfo>
                                <AntDesign name='delete' size={20} color='#000' onPress={() => removeItem(item)} />
                            </Wine>
                        )}
                        ItemSeparatorComponent={Divider}
                        data={wines}
                    />

                </WineListContainer>
            </SafeAreaView>
        </Container>
    )
}




const Container = styled.View`
    flex: 1;
    background-color: #FFF;
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
    width: 150px;
    height: 150px;
    border-radius: 8px;
`;

const WineInfo = styled.View`
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