import React, { useEffect, useState } from "react";
import { firebaseConfig, removeItem } from '../config/firebaseConf';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { SafeAreaView, StatusBar } from 'react-native';
import styled from 'styled-components';
import { AntDesign } from '@expo/vector-icons';

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export default function FavoritesScreen({ navigation }) {
    const [wines, setWines] = useState([])
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


    if (wines.length < 1) {
        return <Text dark>You dont have any favorites yet...</Text>
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
                                <WineInfo onPress={() => navigation.navigate('ItemViewer', { wine: item, from: 'FavoritesScreen' })}>
                                    <Text large heavy dark>{item.name}</Text>
                                    <Text small bold dark>{item.country} | {item.type}</Text>
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