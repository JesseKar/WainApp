import React, { useState } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import styled from 'styled-components';
import { AntDesign } from '@expo/vector-icons';
import { saveItem, removeItem } from '../config/firebaseConf';

export const ItemViewer = ({ navigation, route }) => {

    const [iconName, setIconName] = useState('hearto')

    const wine = route.params.wine;
    const routeFrom = route.params.from;

    if (wine.type === 'red') {
        wine.type = 'Punaviini'
    } else if (wine.type === 'white') {
        wine.type = 'Valkoviini'
    } else if (wine.type === 'rose') {
        wine.type === 'Roseeviini'
    }

    const selectItem = (item) => {
        if (iconName === 'hearto') {
            setIconName('heart')
            saveItem(item)
        }
        if (iconName === 'heart') {
            setIconName('hearto')
            removeItem(item)
        }
    }

    return (
        <Container>
            <StatusBar barStyle="light-content" />
            <WineBackground source={require('../assets/itemwiever_background.jpg')}>
                <SafeAreaView>
                    <MenuBar>
                        <Back>
                            <AntDesign name="arrowleft" size={24} color="#FFF" onPress={() => navigation.navigate(routeFrom)} />
                            <Text style={{ marginLeft: 10 }}>Back</Text>
                        </Back>
                        <AntDesign name={iconName}
                            size={30} color='#fff'
                            onPress={() => selectItem(wine)} />
                    </MenuBar>
                    <WineImage source={{ uri: wine.img }} />
                    <WineView>
                        <Text title heavy>
                            {wine.name}
                        </Text>
                        <Divider />
                        <Text large heavy>
                            {wine.country} | {wine.type}
                        </Text>
                    </WineView>
                </SafeAreaView>
            </WineBackground>
            <DescriptionContainer>
                <Text large dark heavy>
                    Kuvaus:
                </Text>
                <Description>
                    <Text small dark bold>
                        {wine.description}
                    </Text>
                </Description>
            </DescriptionContainer>
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

const WineBackground = styled.ImageBackground`
    width: 100%;
`;

const MenuBar = styled.View`
    flex-direction: row;
    justify-content: space-between;
    padding: 16px;
`;

const Back = styled.View`
    flex-direction: row;
    align-items: center;
`;

const WineView = styled.View`
    padding: 0 32px;
    margin: 30px 0 32px 0;
`;

const Divider = styled.View`
    border-bottom-color: #FFF;
    border-bottom-width: 2px;
    width: 150px;
    margin: 8px 0;
`;

const WineImage = styled.Image`
    width: 200px;
    height: 200px;
    border-radius: 100px;
    margin: 10px 0 0 10px;
`;

const DescriptionContainer = styled.View`
    margin-top: -24px;
    padding: 32px;
    background-color: #fff;
    border-top-left-radius: 24px;
    border-top-right-radius: 24px;
`;

const Description = styled.View`
    margin-top: 16px;
`